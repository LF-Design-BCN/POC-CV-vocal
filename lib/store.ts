import { Redis } from "@upstash/redis";
import type { CVData } from "./schema";

// Stockage clé/valeur via Upstash Redis (le remplaçant de l'ex-Vercel KV,
// retiré du marketplace). Sur Vercel : Storage → Marketplace → chercher
// "Upstash" → installer l'intégration Redis → la lier au projet.
// Ça injecte automatiquement UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
// En local : `vercel env pull .env.local` récupère ces mêmes variables.

const redis = Redis.fromEnv();

export async function saveProfile(id: string, data: CVData) {
  await redis.set(`profile:${id}`, data);
}

export async function loadProfile(id: string): Promise<CVData | null> {
  const data = await redis.get<CVData>(`profile:${id}`);
  return data ?? null;
}

export async function saveLetter(id: string, lettre: string) {
  await redis.set(`letter:${id}`, lettre);
}

export async function loadLetter(id: string): Promise<string | null> {
  const data = await redis.get<string>(`letter:${id}`);
  return data ?? null;
}
