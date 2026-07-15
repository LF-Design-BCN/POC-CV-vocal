"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const canSubmit = prenom.trim().length > 0;

  function commencer() {
    if (!sessionId || !canSubmit) return;
    const params = new URLSearchParams({
      prenom,
      nom,
      telephone,
      linkedin: linkedinUrl,
    });
    router.push(`/conversation/${sessionId}?${params.toString()}`);
  }

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 500 }}>
        Créez votre CV en parlant
      </h1>
      <p style={{ color: "#5F5E5A", lineHeight: 1.6 }}>
        Renseignez vos informations ci-dessous, puis démarrez la
        conversation avec notre assistante. Une fois terminée, votre CV et
        votre lettre de motivation seront générés automatiquement.
      </p>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Prénom *"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          style={inputStyle}
        />
        <input
          type="tel"
          placeholder="Numéro de téléphone (pour le CV)"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          style={inputStyle}
        />
        <input
          type="url"
          placeholder="Lien LinkedIn (optionnel)"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={commencer}
          disabled={!canSubmit}
          style={{
            marginTop: 8,
            padding: "10px 20px",
            border: "none",
            background: canSubmit ? "#2C2C2A" : "#B8B6AC",
            color: "white",
            borderRadius: 8,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Continuer
        </button>
      </div>
    </main>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  maxWidth: 360,
  padding: 10,
  border: "1px solid #D3D1C7",
  borderRadius: 8,
};
