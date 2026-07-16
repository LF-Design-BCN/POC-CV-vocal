import { z } from "zod";

// Ce schéma doit correspondre le plus possible au schéma de "Data collection"
// que tu définis côté ElevenLabs (voir README, section "Config ElevenLabs").
// S'ils ne matchent pas exactement, adapte la fonction mapWebhookPayloadToCVData
// dans app/api/elevenlabs-webhook/route.ts plutôt que de casser ce schéma.

// L'agent renvoie parfois `null` pour un champ qu'il n'a pas pu obtenir
// (ex: "annee": null quand la personne n'a pas donné l'année d'un diplôme).
// z.string().default("") ne couvre que le cas `undefined`, pas `null` —
// ce helper couvre les deux, pour éviter de corriger un champ à la fois à
// chaque nouvelle variation rencontrée en prod.
const nullableString = () =>
  z.preprocess((v) => (v == null ? "" : v), z.string()).default("");

export const ExperienceSchema = z.object({
  poste: nullableString(),
  entreprise: nullableString(),
  dates: nullableString(),
  missions: z.array(nullableString()).default([]),
  resultats: z.array(nullableString()).default([]),
});

export const FormationSchema = z.object({
  diplome: nullableString(),
  etablissement: nullableString(),
  annee: nullableString(),
});

export const CompetenceOutilSchema = z.object({
  nom: nullableString(),
  niveau: z.preprocess(
    (v) => (v == null ? "Intermédiaire" : v),
    z.string()
  ).default("Intermédiaire"),
});

export const CompetenceLangueSchema = z.object({
  nom: nullableString(),
  niveau: z.preprocess(
    (v) => (v == null ? "Intermédiaire" : v),
    z.string()
  ).default("Intermédiaire"),
});

export const CVDataSchema = z.object({
  contact: z
    .object({
      nom: nullableString().optional(),
      telephone: nullableString().optional(),
      email: nullableString().optional(),
      linkedin: nullableString().optional(),
    })
    .default({}),
  secteur_recherche: nullableString(),
  resume_profil: nullableString().optional(),
  experiences: z.array(ExperienceSchema).default([]),
  formations: z.array(FormationSchema).default([]),
  competences: z
    .object({
      outils: z.array(CompetenceOutilSchema).default([]),
      langues: z.array(CompetenceLangueSchema).default([]),
    })
    .default({ outils: [], langues: [] }),
  hobbies: z.array(nullableString()).default([]),
});

export type CVData = z.infer<typeof CVDataSchema>;

export const EMPTY_CV_DATA: CVData = CVDataSchema.parse({});
