import type { CVData } from "./schema";
import { TEMPLATES } from "./templates";

// Logique de génération de la lettre de motivation, partagée entre :
// - la génération automatique déclenchée par le webhook ElevenLabs
// - la régénération manuelle depuis la page résultat (avec une offre ciblée)

export async function chooseTemplate(profile: CVData): Promise<string> {
  const options = TEMPLATES.map(
    (t) => `- ${t.id} : ${t.description} (tags: ${t.tags.join(", ")})`
  ).join("\n");

  const prompt = `Voici un profil candidat au format JSON :
${JSON.stringify(profile, null, 2)}

Voici les modèles de CV disponibles :
${options}

Choisis le modèle le plus adapté au secteur et au profil de cette personne.
Réponds uniquement avec l'identifiant du modèle choisi (par exemple
"classique-marine"), sans aucun autre texte ni explication.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 30,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    // Repli silencieux sur un template par défaut plutôt que de faire
    // échouer tout le pipeline pour un choix de mise en page.
    return TEMPLATES[0].id;
  }

  const data = await res.json();
  const text = (data.content ?? [])
    .map((b: any) => b.text ?? "")
    .join("")
    .trim();

  const found = TEMPLATES.find((t) => text.includes(t.id));
  return found ? found.id : TEMPLATES[0].id;
}

export async function generateCoverLetter(
  profile: CVData,
  offreCiblee?: string
): Promise<string> {
  const prompt = `Tu es un expert en rédaction de lettres de motivation en français.

Voici le profil du candidat, au format JSON :
${JSON.stringify(profile, null, 2)}

${offreCiblee ? `Poste / offre ciblée : ${offreCiblee}` : "Aucune offre précise n'a été fournie : reste générique sur le secteur visé."}

Rédige uniquement le corps de la lettre de motivation, en français, 250 à
350 mots, personnalisé à partir des expériences et compétences ci-dessus,
sans formules toutes faites ni généralités vides. Structure-le en 3
paragraphes (motivation, qualifications concrètes, disponibilité/clôture).
Ne mets ni "Madame, Monsieur", ni formule de politesse finale ("Cordialement"
etc.), ni objet, ni coordonnées : uniquement le corps du texte, ces éléments
sont ajoutés séparément par notre mise en page.`;

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
