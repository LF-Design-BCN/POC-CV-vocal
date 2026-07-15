"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ConversationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const [scriptStatus, setScriptStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const prenom = searchParams.get("prenom") ?? "";
  const nom = searchParams.get("nom") ?? "";
  const telephone = searchParams.get("telephone") ?? "";

  useEffect(() => {
    setLinkedinSummary(sessionStorage.getItem(`linkedin_summary_${params.id}`) ?? "");
    setLinkedinUrl(sessionStorage.getItem(`linkedin_url_${params.id}`) ?? "");
  }, [params.id]);

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
        Cliquez sur le bouton ci-dessous et autorisez le micro. Une fois la
        conversation terminée, cliquez sur le lien en bas de page pour voir
        votre CV.
      </p>

      {!agentId && (
        <p style={{ color: "#993C1D", fontSize: 14 }}>
          NEXT_PUBLIC_ELEVENLABS_AGENT_ID n'est pas configuré.
        </p>
      )}

      {agentId && (
        <div style={{ marginTop: 32, minHeight: 80 }}>
          <Script
            src="https://unpkg.com/@elevenlabs/convai-widget-embed"
            strategy="afterInteractive"
            onLoad={() => setScriptStatus("loaded")}
            onError={() => setScriptStatus("error")}
          />

          {scriptStatus === "loading" && (
            <p style={{ color: "#888780", fontSize: 13 }}>
              Chargement du module vocal...
            </p>
          )}

          {scriptStatus === "error" && (
            <p style={{ color: "#993C1D", fontSize: 14 }}>
              Le script du widget n'a pas pu se charger. Rechargez la page.
            </p>
          )}

          {/* @ts-ignore - custom element ElevenLabs, pas typé par React */}
          <elevenlabs-convai
            agent-id={agentId}
            variant="compact"
            dynamic-variables={JSON.stringify({
              session_id: params.id,
              prenom,
              nom,
              telephone,
              linkedin_url: linkedinUrl,
              linkedin_summary: linkedinSummary,
            })}
          />
        </div>
      )}

      <div style={{ marginTop: 48 }}>
        <a
          href={`/loading/${params.id}`}
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
