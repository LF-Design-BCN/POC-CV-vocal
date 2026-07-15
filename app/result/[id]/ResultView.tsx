"use client";

import { useState } from "react";
import type { CVData } from "@/lib/schema";
import { TEMPLATES } from "@/lib/templates";
import CVTemplate from "@/components/CVTemplate";
import LetterGenerator from "./LetterGenerator";
import PrintButton from "./PrintButton";

export default function ResultView({
  profileId,
  profile,
  lettreInitiale,
  initialTemplateId,
}: {
  profileId: string;
  profile: CVData;
  lettreInitiale: string | null;
  initialTemplateId: string;
}) {
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [saving, setSaving] = useState(false);

  async function changerTemplate(id: string) {
    setTemplateId(id);
    setSaving(true);
    try {
      await fetch("/api/select-template", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profileId, templateId: id }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <PrintButton />
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#5F5E5A", marginBottom: 8 }}>
          Modèle de CV {saving && "(enregistrement...)"}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => changerTemplate(t.id)}
              title={t.description}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border:
                  t.id === templateId
                    ? `2px solid ${t.couleurPrimaire}`
                    : "1px solid #D3D1C7",
                background: t.id === templateId ? "#F7F6F2" : "white",
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: t.couleurPrimaire,
                  display: "inline-block",
                }}
              />
              {t.nom}
            </button>
          ))}
        </div>
      </div>

      <CVTemplate data={profile} templateId={templateId} />

      <LetterGenerator profileId={profileId} profile={profile} lettreInitiale={lettreInitiale} />
    </>
  );
}
