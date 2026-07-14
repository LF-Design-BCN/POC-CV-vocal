import { NextRequest, NextResponse } from "next/server";
import { loadProfile, saveLetter } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { profileId, offreCiblee } = await req.json();

  const profile = await loadProfile(profileId);
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const prompt = `Tu es un expert en rédaction de lettres de motivation en français.

Voici le profil du candidat, au format JSON :
${JSON.stringify(profile, null, 2)}

${offreCiblee ? `Poste / offre ciblée : ${offreCiblee}` : "Aucune offre précise n'a été fournie : reste générique sur le secteur visé."}

Rédige une lettre de motivation professionnelle, en français, 300 à 400 mots,
personnalisée à partir des expériences et compétences ci-dessus, sans formules
toutes faites ni généralités vides. Structure-la en paragraphes clairs, sans
objet ni coordonnées en en-tête (juste le corps de la lettre).`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json(
      { error: "Erreur API Claude", details: errText },
      { status: 502 }
    );
  }

  const data = await res.json();
  const lettre = (data.content ?? [])
    .map((block: any) => block.text ?? "")
    .join("\n")
    .trim();

  await saveLetter(profileId, lettre);

  return NextResponse.json({ lettre });
}
