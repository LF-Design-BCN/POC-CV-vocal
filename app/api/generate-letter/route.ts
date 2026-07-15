import { NextRequest, NextResponse } from "next/server";
import { loadProfile, saveLetter } from "@/lib/store";
import { generateCoverLetter } from "@/lib/anthropic";

// Endpoint de régénération manuelle, utilisé depuis la page résultat quand
// la personne veut cibler une offre précise (la génération automatique via
// le webhook utilise juste le secteur mentionné pendant l'appel).

export async function POST(req: NextRequest) {
  const { profileId, offreCiblee } = await req.json();

  const profile = await loadProfile(profileId);
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  try {
    const lettre = await generateCoverLetter(profile, offreCiblee);
    await saveLetter(profileId, lettre);
    return NextResponse.json({ lettre });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur API Claude", details: err.message },
      { status: 502 }
    );
  }
}
