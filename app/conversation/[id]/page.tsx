"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const widgetRef = useRef<any>(null);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const prenom = searchParams.get("prenom") ?? "";
  const nom = searchParams.get("nom") ?? "";
  const telephone = searchParams.get("telephone") ?? "";

  // Récupération synchrone (avant démarrage de l'appel) des infos LinkedIn
  // stockées par la page d'accueil, pour éviter toute course avec le
  // démarrage automatique de la conversation ci-dessous.
  useEffect(() => {
    setLinkedinSummary(sessionStorage.getItem(`linkedin_summary_${params.id}`) ?? "");
    setLinkedinUrl(sessionStorage.getItem(`linkedin_url_${params.id}`) ?? "");
    setReady(true);
  }, [params.id]);

  // Démarre automatiquement la conversation dès que le widget est prêt, et
  // redirige vers la page de chargement dès que l'appel se termine.
  useEffect(() => {
    if (!ready || !scriptLoaded || !widgetRef.current) return;
    const widget = widgetRef.current;

    const onEnded = () => {
      router.push(`/loading/${params.id}`);
    };

    widget.addEventListener?.("conversationEnded", onEnded);

    const t = setTimeout(() => {
      try {
        widget.startConversation?.();
      } catch {
        // Si l'auto-démarrage échoue (ex: permission micro refusée par le
        // navigateur), le widget reste affiché et cliquable manuellement.
      }
    }, 400);

    return () => {
      widget.removeEventListener?.("conversationEnded", onEnded);
      clearTimeout(t);
    };
  }, [ready, scriptLoaded, params.id, router]);

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F6F2",
      }}
    >
      {!agentId && (
        <p style={{ color: "#993C1D", fontSize: 14 }}>
          NEXT_PUBLIC_ELEVENLABS_AGENT_ID n'est pas configuré.
        </p>
      )}

      {agentId && (
        <>
          <style>{`
            elevenlabs-convai {
              position: relative !important;
              top: auto !important;
              left: auto !important;
              right: auto !important;
              bottom: auto !important;
              transform: none !important;
            }
          `}</style>

          <Script
            src="https://unpkg.com/@elevenlabs/convai-widget-embed"
            strategy="afterInteractive"
            onLoad={() => setScriptLoaded(true)}
            onError={() => setScriptError(true)}
          />

          {scriptError && (
            <p style={{ color: "#993C1D", fontSize: 14 }}>
              Le module vocal n'a pas pu se charger. Rechargez la page.
            </p>
          )}

          {/* @ts-ignore - custom element ElevenLabs, pas typé par React */}
          <elevenlabs-convai
            ref={widgetRef}
            agent-id={agentId}
            variant="compact"
            disable-banner="true"
            dynamic-variables={JSON.stringify({
              session_id: params.id,
              prenom,
              nom,
              telephone,
              linkedin_url: linkedinUrl,
              linkedin_summary: linkedinSummary,
            })}
          />
        </>
      )}
    </main>
  );
}
