import type { CVData } from "@/lib/schema";
import type { CVTemplateMeta } from "@/lib/templates";
import { fontStack, ExperienceItem, FormationItem, SectionTitle, CompetencesRow, HobbiesSection } from "./shared";

export default function BandeauLayout({
  data,
  meta,
}: {
  data: CVData;
  meta: CVTemplateMeta;
}) {
  return (
    <div
      style={{
        background: "white",
        maxWidth: 700,
        margin: "0 auto",
        border: "1px solid #E5E3DA",
        fontFamily: fontStack(meta.police),
        color: "#2C2C2A",
      }}
    >
      <div style={{ background: meta.couleurPrimaire, color: "white", padding: "28px 40px" }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>{data.contact?.nom || "Nom du candidat"}</h1>
        <p style={{ margin: "4px 0 0", opacity: 0.9 }}>{data.secteur_recherche}</p>
        <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.85 }}>
          {[data.contact?.telephone, data.contact?.email].filter(Boolean).join(" · ")}
          {data.contact?.linkedin && (
            <>
              {" · "}
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                {data.contact.linkedin}
              </a>
            </>
          )}
        </p>
      </div>

      <div style={{ padding: 40 }}>
        {data.resume_profil && (
          <p style={{ fontStyle: "italic", color: "#444441", marginTop: 0 }}>{data.resume_profil}</p>
        )}

        <section>
          <SectionTitle color={meta.couleurAccent}>Expériences professionnelles</SectionTitle>
          {data.experiences.map((exp, i) => (
            <ExperienceItem key={i} exp={exp} />
          ))}
        </section>

        <section style={{ marginTop: 20 }}>
          <SectionTitle color={meta.couleurAccent}>Formations</SectionTitle>
          {data.formations.map((f, i) => (
            <FormationItem key={i} f={f} />
          ))}
        </section>

        <section style={{ marginTop: 20 }}>
          <CompetencesRow data={data} color={meta.couleurAccent} />
        </section>

        <HobbiesSection data={data} color={meta.couleurAccent} />
      </div>
    </div>
  );
}
