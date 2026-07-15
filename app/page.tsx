"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Script from "next/script";

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Identifiant unique pour relier cette session vocale à un profil.
    // Passé à l'agent en dynamic variable pour qu'on le retrouve dans le webhook.
    setSessionId(uuidv4());
  }, []);

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const canStart = prenom.trim().length > 0;

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 500 }}>
        Créez votre CV en parlant
      </h1>
      <p style={{ color: "#5F5E5A", lineHeight: 1.6 }}>
        Renseignez votre prénom et nom, puis cliquez sur le bouton pour
        démarrer. Une fois la conversation terminée, votre CV et votre
        lettre de motivation seront générés automatiquement.
      </p>

      {!agentId && (
        <p style={{ color: "#993C1D", fontSize: 14 }}>
          NEXT_PUBLIC_ELEVENLABS_AGENT_ID n'est pas configuré (voir .env.example).
        </p>
      )}

      {!started && (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: 10,
              border: "1px solid #D3D1C7",
              borderRadius: 8,
            }}
          />
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: 10,
              border: "1px solid #D3D1C7",
              borderRadius: 8,
            }}
          />
          <button
            onClick={() => setStarted(true)}
            disabled={!canStart}
            style={{
              marginTop: 8,
              padding: "10px 20px",
              border: "none",
              background: canStart ? "#2C2C2A" : "#B8B6AC",
              color: "white",
              borderRadius: 8,
              cursor: canStart ? "pointer" : "not-allowed",
            }}
          >
            Commencer
          </button>
        </div>
      )}

      {started && agentId && sessionId && (
        <div style={{ marginTop: 32 }}>
          <Script
            src="https://unpkg.com/@elevenlabs/convai-widget-embed"
            strategy="afterInteractive"
          />
          {/* @ts-ignore - custom element ElevenLabs, pas typé par React */}
          <elevenlabs-convai
            agent-id={agentId}
            dynamic-variables={JSON.stringify({
              session_id: sessionId,
              prenom,
              nom,
            })}
          />
          <p style={{ color: "#888780", fontSize: 12, marginTop: 16 }}>
            Session : {sessionId}
          </p>
        </div>
      )}
    </main>
  );
}
