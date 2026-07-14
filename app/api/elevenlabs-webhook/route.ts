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
    contact: collected.contact ?? {},
    secteur_recherche: collected.secteur_recherche ?? "",
    resume_profil: collected.resume_profil,
    experiences: collected.experiences ?? [],
    formations: collected.formations ?? [],
    competences: collected.competences ?? { outils: [], langues: [] },
    hobbies: collected.hobbies ?? [],
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
