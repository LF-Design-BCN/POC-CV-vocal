"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const widgetRef = useRef<any>(null);
  const startedRef = useRef(false);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [ready, setReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const prenom = searchParams.get("prenom") ?? "";
  const nom = searchParams.get("nom") ?? "";
  const telephone = searchParams.get("telephone") ?? "";

  useEffect(() => {
    setLinkedinSummary(sessionStorage.getItem(`linkedin_summary_${params.id}`) ?? "");
    setLinkedinUrl(sessionStorage.getItem(`linkedin_url_${params.id}`) ?? "");
    setReady(true);
  }, [params.id]);

  // Centrage du widget : on garde `position: fixed` (probablement requis par
  // son fonctionnement interne — le display:none et le passage en `relative`
  // ont tous les deux cassé son fonctionnement dans les tentatives
  // précédentes), et on centre avec inset+margin:auto plutôt qu'un
  // transform, pour ne pas entrer en conflit avec ses propres animations.
  useEffect(() => {
    if (!scriptLoaded) return;
    const style = document.createElement("style");
    style.setAttribute("data-cv-vocal-override", "true");
    style.textContent = `
      #cv-vocal-widget {
        position: fixed !important;
        inset: 0 !important;
        margin: auto !important;
        width: 360px !important;
        height: 360px !important;
        --elevenlabs-convai-widget-width: 360px;
        --elevenlabs-convai-widget-height: 360px;
      }
    `;
    const t = setTimeout(() => document.head.appendChild(style), 200);
    return () => {
      clearTimeout(t);
      style.remove();
    };
  }, [scriptLoaded]);

  useEffect(() => {
    if (!ready || !scriptLoaded || !widgetRef.current) return;
    const widget = widgetRef.current;

    const onStarted = () => {
      startedRef.current = true;
      setShowFallback(false);
    };
    const onEnded = () => {
      router.push(`/loading/${params.id}`);
    };

    widget.addEventListener?.("conversationStarted", onStarted);
    widget.addEventListener?.("conversationEnded", onEnded);

    const startTimeout = setTimeout(() => {
      try {
        widget.startConversation?.();
      } catch {
        // Géré par le bouton de secours ci-dessous si ça ne démarre pas.
      }
    }, 400);

    const fallbackTimeout = setTimeout(() => {
      if (!startedRef.current) setShowFallback(true);
    }, 4000);

    return () => {
      widget.removeEventListener?.("conversationStarted", onStarted);
      widget.removeEventListener?.("conversationEnded", onEnded);
      clearTimeout(startTimeout);
      clearTimeout(fallbackTimeout);
    };
  }, [ready, scriptLoaded, params.id, router]);

  function demarrerManuellement() {
    try {
      widgetRef.current?.startConversation?.();
    } catch {
      // rien de plus à faire ici, le bouton reste affiché pour réessayer
    }
  }

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
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

          {showFallback && (
            <button
              onClick={demarrerManuellement}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "#2C2C2A",
                color: "white",
                borderRadius: 8,
                cursor: "pointer",
                position: "relative",
                zIndex: 10,
              }}
            >
              Démarrer l'appel
            </button>
          )}

          {/* @ts-ignore - custom element ElevenLabs, pas typé par React */}
          <elevenlabs-convai
            id="cv-vocal-widget"
            ref={widgetRef}
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
        </>
      )}
    </main>
  );
}
