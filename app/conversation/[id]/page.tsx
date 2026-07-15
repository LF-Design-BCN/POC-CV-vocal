"use client";

import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ConversationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const prenom = searchParams.get("prenom") ?? "";
  const nom = searchParams.get("nom") ?? "";
  const telephone = searchParams.get("telephone") ?? "";
  const linkedinUrl = searchParams.get("linkedin") ?? "";

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 500 }}>
        {prenom ? `À vous, ${prenom}` : "C'est parti"}
      </h1>
      <p style={{ color: "#5F5E5A", lineHeight: 1.6 }}>
        Cliquez sur "Démarrer l'appel" et autorisez le micro. Une fois la
        conversation terminée, cliquez sur le lien en bas de page pour voir
        votre CV.
      </p>

      {!agentId && (
        <p style={{ color: "#993C1D", fontSize: 14 }}>
          NEXT_PUBLIC_ELEVENLABS_AGENT_ID n'est pas configuré (voir .env.example).
        </p>
      )}

      {agentId && (
        <div style={{ marginTop: 32 }}>
          <Script
            src="https://unpkg.com/@elevenlabs/convai-widget-embed"
            strategy="afterInteractive"
          />
          {/* variant="compact" = juste la boule + bouton, pas de panneau de transcript */}
          {/* @ts-ignore - custom element ElevenLabs, pas typé par React */}
          <elevenlabs-convai
            agent-id={agentId}
            variant="compact"
            start-call-text="Démarrer l'appel"
            end-call-text="Terminer l'appel"
            action-text="Parler à l'assistante"
            dynamic-variables={JSON.stringify({
              session_id: params.id,
              prenom,
              nom,
              telephone,
              linkedin_url: linkedinUrl,
            })}
          />
        </div>
      )}

      <div style={{ marginTop: 48 }}>
        <a
          href={`/result/${params.id}`}
          style={{
            color: "#5F5E5A",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          J'ai terminé — voir mon CV
        </a>
      </div>
    </main>
  );
}
