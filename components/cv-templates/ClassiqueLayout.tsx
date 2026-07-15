import type { CVData } from "@/lib/schema";
import type { CVTemplateMeta } from "@/lib/templates";
import {
  fontStack,
  ExperienceItem,
  FormationItem,
  SectionTitle,
  CompetencesRow,
  HobbiesSection,
  ContactLine,
} from "./shared";

export default function ClassiqueLayout({
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
        padding: 40,
        border: "1px solid #E5E3DA",
        fontFamily: fontStack(meta.police),
        color: "#2C2C2A",
      }}
    >
      <header style={{ borderBottom: `2px solid ${meta.couleurPrimaire}`, paddingBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: meta.couleurPrimaire }}>
          {data.contact?.nom || "Nom du candidat"}
        </h1>
        <p style={{ margin: "4px 0 0", color: "#5F5E5A" }}>{data.secteur_recherche}</p>
        <ContactLine data={data} textColor="#888780" />
      </header>

      {data.resume_profil && (
        <p style={{ marginTop: 16, fontStyle: "italic", color: "#444441" }}>{data.resume_profil}</p>
      )}

      <section style={{ marginTop: 20 }}>
        <SectionTitle color={meta.couleurPrimaire}>Expériences professionnelles</SectionTitle>
        {data.experiences.map((exp, i) => (
          <ExperienceItem key={i} exp={exp} />
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <SectionTitle color={meta.couleurPrimaire}>Formations</SectionTitle>
        {data.formations.map((f, i) => (
          <FormationItem key={i} f={f} />
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <CompetencesRow data={data} color={meta.couleurPrimaire} />
      </section>

      <HobbiesSection data={data} color={meta.couleurPrimaire} />
    </div>
  );
}
