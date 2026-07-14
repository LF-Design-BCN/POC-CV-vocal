import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { CVDataSchema, type CVData } from "@/lib/schema";
import { saveProfile } from "@/lib/store";

// IMPORTANT : la forme exacte du payload webhook ElevenLabs (noms des champs
// dans "analysis.data_collection_results", nom du champ contenant tes
// dynamic variables, etc.) peut évoluer. Avant de brancher ça en vrai,
// affiche le payload reçu (console.log ci-dessous) une première fois et
// ajuste mapWebhookPayloadToCVData si besoin. Vérifie aussi la doc à jour :
// https://elevenlabs.io/docs/conversational-ai/workflows/post-call-webhooks

function verifySignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) return true; // POC : pas de secret configuré, on ne vérifie pas
  if (!signatureHeader) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}

// La "Data Collection" d'ElevenLabs ne supporte que des types plats
// (Boolean, Integer, Number, String) — pas d'objets ni de tableaux imbriqués.
// On demande donc les champs complexes sous forme de String contenant du
// JSON stringifié (ex: experiences_json), qu'on parse ici nous-même.
// Voir le tableau de config dans le README pour la liste exacte des champs
// à créer côté dashboard ElevenLabs.

function safeParseArray<T>(raw: unknown, fallback: T[] = []): T[] {
  if (typeof raw !== "string" || raw.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    // Le modèle d'extraction n'a pas renvoyé du JSON valide : on ne bloque
    // pas tout le profil pour ça, on retombe sur un tableau vide pour ce
    // champ. Pense à vérifier ces cas dans tes logs pendant la mise au point.
    return fallback;
  }
}

function mapWebhookPayloadToCVData(payload: any): {
  sessionId: string | null;
  data: CVData;
} {
  // À ajuster selon la structure réelle observée dans tes logs.
  const collected =
    payload?.analysis?.data_collection_results ??
    payload?.data_collection_results ??
    {};

  const sessionId =
    payload?.conversation_initiation_client_data?.dynamic_variables
      ?.session_id ?? payload?.conversation_id ?? null;

  const raw = {
    contact: {
      nom: collected.contact_nom ?? "",
      telephone: collected.contact_telephone ?? "",
      email: collected.contact_email ?? "",
    },
    secteur_recherche: collected.secteur_recherche ?? "",
    experiences: safeParseArray(collected.experiences_json),
    formations: safeParseArray(collected.formations_json),
    competences: {
      outils: safeParseArray(collected.outils_json),
      langues: safeParseArray(collected.langues_json),
    },
    hobbies: safeParseArray<string>(collected.hobbies_json),
  };

  return { sessionId, data: CVDataSchema.parse(raw) };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("elevenlabs-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // Décommente pendant la mise au point pour voir la vraie forme du payload :
  // console.log(JSON.stringify(payload, null, 2));

  const { sessionId, data } = mapWebhookPayloadToCVData(payload);

  if (!sessionId) {
    return NextResponse.json(
      { error: "Impossible de retrouver le session_id" },
      { status: 400 }
    );
  }

  await saveProfile(sessionId, data);

  return NextResponse.json({ ok: true, profileId: sessionId });
}
