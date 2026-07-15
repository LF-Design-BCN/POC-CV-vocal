"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Orb, type AgentState } from "@/components/ui/orb";

// Le composant Orb officiel utilise deux classes utilitaires ("relative",
// "h-full", "w-full") qui viennent normalement de Tailwind. On n'installe
// pas tout Tailwind juste pour ça : on définit ces deux règles nous-mêmes.
function OrbUtilityStyles() {
  return (
    <style>{`
      .relative { position: relative; }
      .h-full { height: 100%; }
      .w-full { width: 100%; }
    `}</style>
  );
}

function OrbVisual({ status, isSpeaking }: { status: string; isSpeaking: boolean }) {
  const agentState: AgentState =
    status !== "connected" ? null : isSpeaking ? "talking" : "listening";

  return (
    <>
      <OrbUtilityStyles />
      <div style={{ width: 240, height: 240 }}>
        <Orb agentState={agentState} colors={["#1B2A4A", "#6EC1E4"]} />
      </div>
    </>
  );
}

function ConversationScreen({
  agentId,
  sessionId,
  dynamicVariables,
}: {
  agentId: string;
  sessionId: string;
  dynamicVariables: Record<string, string>;
}) {
  const router = useRouter();
  const { status, isSpeaking, startSession } = useConversation();
  const [showFallback, setShowFallback] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        await startSession({
          agentId,
          dynamicVariables,
          onConnect: () => {
            startedRef.current = true;
            setShowFallback(false);
          },
          onDisconnect: () => {
            router.push(`/loading/${sessionId}`);
          },
          onError: () => {
            setShowFallback(true);
          },
        });
      } catch {
        setShowFallback(true);
      }
    }, 400);

    const fallbackTimeout = setTimeout(() => {
      if (!startedRef.current) setShowFallback(true);
    }, 6000);

    return () => {
      clearTimeout(t);
      clearTimeout(fallbackTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function demarrerManuellement() {
    try {
      await startSession({
        agentId,
        dynamicVariables,
        onConnect: () => setShowFallback(false),
        onDisconnect: () => router.push(`/loading/${sessionId}`),
      });
    } catch {
      // le bouton reste affiché pour réessayer
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
      <OrbVisual status={status} isSpeaking={isSpeaking} />

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
          }}
        >
          Démarrer l'appel
        </button>
      )}
    </main>
  );
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [ready, setReady] = useState(false);

  const prenom = searchParams.get("prenom") ?? "";
  const nom = searchParams.get("nom") ?? "";
  const telephone = searchParams.get("telephone") ?? "";

  useEffect(() => {
    setLinkedinSummary(sessionStorage.getItem(`linkedin_summary_${params.id}`) ?? "");
    setLinkedinUrl(sessionStorage.getItem(`linkedin_url_${params.id}`) ?? "");
    setReady(true);
  }, [params.id]);

  if (!agentId) {
    return (
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#993C1D", fontSize: 14 }}>
          NEXT_PUBLIC_ELEVENLABS_AGENT_ID n'est pas configuré.
        </p>
      </main>
    );
  }

  if (!ready) return null;

  return (
    <ConversationProvider agentId={agentId}>
      <ConversationScreen
        agentId={agentId}
        sessionId={params.id}
        dynamicVariables={{
          session_id: params.id,
          prenom,
          nom,
          telephone,
          linkedin_url: linkedinUrl,
          linkedin_summary: linkedinSummary,
        }}
      />
    </ConversationProvider>
  );
}
