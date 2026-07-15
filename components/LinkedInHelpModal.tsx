"use client";

import { useState } from "react";

export default function LinkedInHelpModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          color: "#2C2C2A",
          textDecoration: "underline",
          fontSize: 12,
          cursor: "pointer",
          padding: 0,
        }}
      >
        Comment faire ?
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 12,
              padding: 28,
              maxWidth: 560,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 18, margin: 0 }}>
                Exporter votre profil LinkedIn en PDF
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#888780",
                }}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <Step
              numero={1}
              titre="Ouvrez votre profil LinkedIn"
              description='Depuis votre profil, repérez le bouton "Ressources" en haut de la page (à côté de "Ajouter la section du profil").'
            >
              <svg viewBox="0 0 480 140" style={{ width: "100%", height: "auto" }}>
                <rect x="0" y="0" width="480" height="140" rx="8" fill="#F7F6F2" stroke="#D3D1C7" />
                <circle cx="40" cy="35" r="16" fill="#D3D1C7" />
                <rect x="66" y="26" width="90" height="9" rx="4" fill="#B8B6AC" />
                <rect x="66" y="42" width="60" height="7" rx="3" fill="#D3D1C7" />
                <rect x="330" y="20" width="130" height="32" rx="6" fill="white" stroke="#2C2C2A" strokeWidth="2" />
                <text x="395" y="40" textAnchor="middle" fontSize="13" fill="#2C2C2A" fontFamily="sans-serif">
                  Ressources ▾
                </text>
                <path d="M 395 58 L 395 75" stroke="#993C1D" strokeWidth="2" markerEnd="url(#arrow1)" />
                <defs>
                  <marker id="arrow1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L10 5 L0 10 Z" fill="#993C1D" />
                  </marker>
                </defs>
                <text x="395" y="95" textAnchor="middle" fontSize="12" fill="#993C1D" fontFamily="sans-serif">
                  Cliquez ici
                </text>
              </svg>
            </Step>

            <Step
              numero={2}
              titre='Choisissez "Enregistrer au format PDF"'
              description="Un menu déroulant s'ouvre. Sélectionnez cette option — LinkedIn génère alors un PDF de votre profil complet."
            >
              <svg viewBox="0 0 480 140" style={{ width: "100%", height: "auto" }}>
                <rect x="0" y="0" width="480" height="140" rx="8" fill="#F7F6F2" stroke="#D3D1C7" />
                <rect x="270" y="10" width="190" height="120" rx="6" fill="white" stroke="#D3D1C7" />
                <rect x="280" y="20" width="170" height="24" rx="4" fill="#F0EFE9" />
                <text x="290" y="36" fontSize="12" fill="#5F5E5A" fontFamily="sans-serif">
                  Importer/exporter des données
                </text>
                <rect x="280" y="52" width="170" height="26" rx="4" fill="white" stroke="#2C2C2A" strokeWidth="1.5" />
                <text x="290" y="69" fontSize="12" fill="#2C2C2A" fontFamily="sans-serif" fontWeight="bold">
                  Enregistrer au format PDF
                </text>
                <path d="M 445 65 L 460 65" stroke="#993C1D" strokeWidth="2" markerEnd="url(#arrow2)" />
                <defs>
                  <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L10 5 L0 10 Z" fill="#993C1D" />
                  </marker>
                </defs>
                <rect x="280" y="90" width="170" height="24" rx="4" fill="#F0EFE9" />
                <text x="290" y="106" fontSize="12" fill="#5F5E5A" fontFamily="sans-serif">
                  Partager le profil via...
                </text>
              </svg>
            </Step>

            <Step
              numero={3}
              titre="Uploadez le fichier téléchargé"
              description='Le PDF se télécharge sur votre ordinateur. Revenez sur cette page et sélectionnez-le dans le champ "Export PDF de votre profil LinkedIn".'
            >
              <svg viewBox="0 0 480 100" style={{ width: "100%", height: "auto" }}>
                <rect x="0" y="0" width="480" height="100" rx="8" fill="#F7F6F2" stroke="#D3D1C7" />
                <rect x="170" y="25" width="50" height="60" rx="4" fill="white" stroke="#2C2C2A" strokeWidth="1.5" />
                <text x="195" y="60" textAnchor="middle" fontSize="11" fill="#993C1D" fontFamily="sans-serif" fontWeight="bold">
                  PDF
                </text>
                <path d="M 240 55 L 270 55" stroke="#5F5E5A" strokeWidth="2" markerEnd="url(#arrow3)" />
                <defs>
                  <marker id="arrow3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L10 5 L0 10 Z" fill="#5F5E5A" />
                  </marker>
                </defs>
                <rect x="280" y="30" width="140" height="40" rx="6" fill="white" stroke="#2C2C2A" strokeWidth="1.5" />
                <text x="350" y="54" textAnchor="middle" fontSize="12" fill="#2C2C2A" fontFamily="sans-serif">
                  Choisir un fichier
                </text>
              </svg>
            </Step>

            <button
              onClick={() => setOpen(false)}
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
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Step({
  numero,
  titre,
  description,
  children,
}: {
  numero: number;
  titre: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 20, textAlign: "left" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
        <span
          style={{
            background: "#2C2C2A",
            color: "white",
            borderRadius: "50%",
            width: 22,
            height: 22,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          {numero}
        </span>
        <h3 style={{ fontSize: 14, margin: 0 }}>{titre}</h3>
      </div>
      <p style={{ fontSize: 13, color: "#5F5E5A", margin: "6px 0 10px 32px" }}>
        {description}
      </p>
      <div style={{ marginLeft: 32 }}>{children}</div>
    </div>
  );
}
