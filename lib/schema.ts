import { z } from "zod";

// Ce schéma doit correspondre le plus possible au schéma de "Data collection"
// que tu définis côté ElevenLabs (voir README, section "Config ElevenLabs").
// S'ils ne matchent pas exactement, adapte la fonction mapWebhookPayloadToCVData
// dans app/api/elevenlabs-webhook/route.ts plutôt que de casser ce schéma.

export const ExperienceSchema = z.object({
  poste: z.string().default(""),
  entreprise: z.string().default(""),
  dates: z.string().default(""),
  missions: z.array(z.string()).default([]),
  resultats: z.array(z.string()).default([]),
});

export const FormationSchema = z.object({
  diplome: z.string().default(""),
  etablissement: z.string().default(""),
  annee: z.string().default(""),
});

export const CompetenceOutilSchema = z.object({
  nom: z.string(),
  niveau: z.string().default("Intermédiaire"),
});

export const CompetenceLangueSchema = z.object({
  nom: z.string(),
  niveau: z.string().default("Intermédiaire"),
});

export const CVDataSchema = z.object({
  contact: z
    .object({
      nom: z.string().optional(),
      telephone: z.string().optional(),
      email: z.string().optional(),
    })
    .default({}),
  secteur_recherche: z.string().default(""),
  resume_profil: z.string().optional(),
  experiences: z.array(ExperienceSchema).default([]),
  formations: z.array(FormationSchema).default([]),
  competences: z
    .object({
      outils: z.array(CompetenceOutilSchema).default([]),
      langues: z.array(CompetenceLangueSchema).default([]),
    })
    .default({ outils: [], langues: [] }),
  hobbies: z.array(z.string()).default([]),
});

export type CVData = z.infer<typeof CVDataSchema>;

export const EMPTY_CV_DATA: CVData = CVDataSchema.parse({});
