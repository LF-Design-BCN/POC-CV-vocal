import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { CVDataSchema, type CVData } from "@/lib/schema";
import { saveProfile, saveLetter, saveSelectedTemplate } from "@/lib/store";
import { generateCoverLetter, chooseTemplate } from "@/lib/anthropic";

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
  // Structure réelle confirmée par la doc officielle ElevenLabs : tout est
  // imbriqué sous payload.data (analysis, conversation_initiation_client_data,
  // conversation_id...), pas à la racine du payload.
  const callData = payload?.data ?? payload;

  const collected =
    callData?.analysis?.data_collection_results ??
    callData?.data_collection_results ??
    {};

  const dynamicVars =
    callData?.conversation_initiation_client_data?.dynamic_variables ?? {};

  const sessionId = dynamicVars.session_id ?? callData?.conversation_id ?? null;

  // Prénom/nom/téléphone/lien LinkedIn viennent du formulaire (dynamic
  // variables), donc plus fiables que ce que l'agent pourrait ré-extraire
  // du transcript. contact_email reste extrait via la Data Collection, car
  // le formulaire ne le demande pas.
  const nomComplet = [dynamicVars.prenom, dynamicVars.nom]
    .filter(Boolean)
    .join(" ")
    .trim();

  const raw = {
    contact: {
      nom: nomComplet || collected.contact_nom || "",
      telephone: dynamicVars.telephone || collected.contact_telephone || "",
      email: collected.contact_email ?? "",
      linkedin: dynamicVars.linkedin_url || "",
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

  // ElevenLabs peut aussi envoyer d'autres types de webhook sur cette même
  // URL (échec d'initiation d'appel, webhook audio) : on ne traite que les
  // webhooks de transcription/analyse, qui sont les seuls à contenir les
  // données du profil.
  if (payload?.type && payload.type !== "post_call_transcription") {
    return NextResponse.json({ ok: true, skipped: payload.type });
  }

  // Décommente pendant la mise au point pour voir la vraie forme du payload :
  console.log(JSON.stringify(payload, null, 2));

  const { sessionId, data } = mapWebhookPayloadToCVData(payload);

  if (!sessionId) {
    return NextResponse.json(
      { error: "Impossible de retrouver le session_id" },
      { status: 400 }
    );
  }

  await saveProfile(sessionId, data);

  // Choix automatique du template de CV le plus adapté au profil/secteur.
  try {
    const templateId = await chooseTemplate(data);
    await saveSelectedTemplate(sessionId, templateId);
  } catch (err) {
    console.error("Choix automatique du template échoué:", err);
    // Pas de fallback à écrire ici : l'absence de valeur fera retomber sur
    // le template par défaut côté page résultat.
  }

  // Génération automatique de la lettre de motivation, sans action manuelle.
  // On cible par défaut le secteur mentionné pendant l'appel (pas d'offre
  // précise disponible à ce stade) ; l'utilisateur pourra toujours en
  // régénérer une plus ciblée depuis la page résultat.
  try {
    const lettre = await generateCoverLetter(data, data.secteur_recherche);
    await saveLetter(sessionId, lettre);
  } catch (err) {
    // On ne fait pas échouer le webhook pour ça : le CV reste consultable
    // même si la lettre automatique a échoué, et l'utilisateur pourra la
    // régénérer manuellement depuis la page résultat.
    console.error("Génération automatique de la lettre échouée:", err);
  }

  return NextResponse.json({ ok: true, profileId: sessionId });
}
