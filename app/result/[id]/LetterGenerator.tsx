"use client";

import { useState } from "react";

export default function LetterGenerator({ profileId }: { profileId: string }) {
  const [offreCiblee, setOffreCiblee] = useState("");
  const [lettre, setLettre] = useState<string | null>(null);
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
      <h2 style={{ fontSize: 18 }}>Lettre de motivation</h2>
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
        {loading ? "Génération en cours..." : "Générer la lettre"}
      </button>

      {error && <p style={{ color: "#993C1D" }}>{error}</p>}

      {lettre && (
        <div
          style={{
            marginTop: 20,
            background: "white",
            padding: 20,
            border: "1px solid #E5E3DA",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          }}
        >
          {lettre}
        </div>
      )}
    </div>
  );
}
