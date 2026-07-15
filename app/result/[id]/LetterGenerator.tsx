"use client";

import { useState } from "react";
import type { CVData } from "@/lib/schema";
import LettreTemplate from "@/components/LettreTemplate";

export default function LetterGenerator({
  profileId,
  profile,
  lettreInitiale,
}: {
  profileId: string;
  profile: CVData;
  lettreInitiale: string | null;
}) {
  const [offreCiblee, setOffreCiblee] = useState("");
  const [lettre, setLettre] = useState<string | null>(lettreInitiale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generer() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profileId, offreCiblee }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue");
      setLettre(data.lettre);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, textAlign: "center" }}>Lettre de motivation</h2>
      <p style={{ color: "#5F5E5A", fontSize: 14, textAlign: "center" }}>
        {lettreInitiale
          ? "Une première version a été générée automatiquement. Vous pouvez la régénérer en ciblant une offre précise :"
          : "Aucune lettre générée automatiquement pour l'instant. Vous pouvez en générer une :"}
      </p>
      <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Poste ou offre ciblée (optionnel)"
          value={offreCiblee}
          onChange={(e) => setOffreCiblee(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid #D3D1C7",
            borderRadius: 8,
            marginTop: 8,
          }}
        />
        <button
          onClick={generer}
          disabled={loading}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            border: "none",
            background: "#2C2C2A",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Génération en cours..."
            : lettreInitiale
            ? "Régénérer pour une offre précise"
            : "Générer la lettre"}
        </button>

        {error && <p style={{ color: "#993C1D" }}>{error}</p>}
      </div>

      {lettre && (
        <div style={{ marginTop: 20 }}>
          <LettreTemplate corps={lettre} profile={profile} />
        </div>
      )}
    </div>
  );
}
