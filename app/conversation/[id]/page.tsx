"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

type OrbState = "connecting" | "active" | "ended";

function Orb({ state }: { state: OrbState }) {
  return (
    <>
      <style>{`
        @keyframes cv-orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cv-orb-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, #1B2A4A, #6EC1E4, #1B2A4A)",
          filter: "blur(1px)",
          opacity: state === "ended" ? 0.4 : 1,
          transition: "opacity 0.4s",
          animation:
            state === "active"
              ? "cv-orb-spin 6s linear infinite, cv-orb-pulse 2.4s ease-in-out infinite"
              : "cv-orb-spin 12s linear infinite",
        }}
      />
    </>
  );
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const widgetRef = useRef<any>(null);
  const startedRef = useRef(false);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [ready, setReady] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("connecting");
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

  useEffect(() => {
    if (!ready || !scriptLoaded || !widgetRef.current) return;
    const widget = widgetRef.current;

    const onStarted = () => {
      startedRef.current = true;
      setOrbState("active");
      setShowFallback(false);
    };
    const onEnded = () => {
      setOrbState("ended");
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

    // Si l'auto-démarrage échoue silencieusement (permission micro refusée,
    // widget pas encore prêt...), on affiche un bouton de secours après
    // quelques secondes plutôt que de laisser un écran bloqué sans recours.
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

          <Orb state={orbState} />

          {showFallback && orbState === "connecting" && (
            <button
              onClick={demarrerManuellement}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "#2C2C2A",
                color: "white",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Démarrer l'appel
            </button>
          )}

          {/* Widget réel : jamais affiché, mais toujours fonctionnel en
              arrière-plan (le display:none n'empêche pas l'audio/WebRTC). */}
          <div style={{ display: "none" }}>
            {/* @ts-ignore - custom element ElevenLabs, pas typé par React */}
            <elevenlabs-convai
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
          </div>
        </>
      )}
    </main>
  );
}
