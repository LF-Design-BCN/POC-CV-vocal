import type { CVData } from "./schema";

// Logique de génération de la lettre de motivation, partagée entre :
// - la génération automatique déclenchée par le webhook ElevenLabs
// - la régénération manuelle depuis la page résultat (avec une offre ciblée)

export async function generateCoverLetter(
  profile: CVData,
  offreCiblee?: string
): Promise<string> {
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
    throw new Error(`Erreur API Claude (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return (data.content ?? [])
    .map((block: any) => block.text ?? "")
    .join("\n")
    .trim();
}

// Résume un export PDF de profil LinkedIn (texte brut déjà extrait) en un
// texte concis et structuré, destiné à être transmis à l'agent vocal en
// dynamic variable pour qu'il puisse citer précisément entreprises, dates,
// formations, etc. plutôt que de partir de zéro.

export async function extractLinkedInSummary(rawText: string): Promise<string> {
  const prompt = `Voici le texte brut extrait d'un export PDF de profil LinkedIn :

"""
${rawText.slice(0, 15000)}
"""

Résume ce profil de façon structurée et concise, en français, pour qu'un
agent vocal puisse s'en servir pendant un entretien. Utilise ce format :

Expériences :
- [Poste] chez [Entreprise] ([dates])
- ...

Formations :
- [Diplôme] à [Établissement] ([année])
- ...

Langues (si mentionnées) :
- [Langue] : [niveau]

Ne rajoute aucune information qui n'est pas explicitement dans le texte.
Si une section est absente du profil, omets-la entièrement. Reste sous
600 mots.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur API Claude (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return (data.content ?? [])
    .map((block: any) => block.text ?? "")
    .join("\n")
    .trim();
}
