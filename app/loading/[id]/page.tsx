"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tentatives, setTentatives] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/profile-status?id=${params.id}`);
        const data = await res.json();
        if (data.ready) {
          clearInterval(interval);
          router.push(`/result/${params.id}`);
        } else {
          setTentatives((n) => n + 1);
        }
      } catch {
        setTentatives((n) => n + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id, router]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: 24,
        gap: 20,
      }}
    >
      <style>{`
        @keyframes cv-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #E5E3DA",
          borderTopColor: "#2C2C2A",
          borderRadius: "50%",
          animation: "cv-spin 0.8s linear infinite",
        }}
      />
      <p style={{ fontSize: 16 }}>Génération de votre CV et de votre lettre de motivation...</p>
      {tentatives > 15 && (
        <p style={{ fontSize: 13, color: "#888780", marginTop: -8 }}>
          Ça prend plus de temps que prévu.{" "}
          <a href={`/result/${params.id}`}>Essayer d'accéder au résultat</a>.
        </p>
      )}
    </main>
  );
}
