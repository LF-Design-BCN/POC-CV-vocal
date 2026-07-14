import { kv } from "@vercel/kv";
import type { CVData } from "./schema";

// Stockage clé/valeur via Vercel KV. Nécessite d'ajouter l'intégration
// "KV" (Storage > KV) sur ton projet Vercel : elle injecte automatiquement
// les variables d'env KV_REST_API_URL / KV_REST_API_TOKEN.
// En local, `vercel env pull` récupère ces mêmes variables dans .env.local.

export async function saveProfile(id: string, data: CVData) {
  await kv.set(`profile:${id}`, data);
}

export async function loadProfile(id: string): Promise<CVData | null> {
  const data = await kv.get<CVData>(`profile:${id}`);
  return data ?? null;
}

export async function saveLetter(id: string, lettre: string) {
  await kv.set(`letter:${id}`, lettre);
}

export async function loadLetter(id: string): Promise<string | null> {
  const data = await kv.get<string>(`letter:${id}`);
  return data ?? null;
}
