import type { CVData } from "@/lib/schema";
import type { CVTemplateMeta } from "@/lib/templates";
import { fontStack, FormationItem, SectionTitle, CompetencesRow, HobbiesSection, ContactLine } from "./shared";

export default function TimelineLayout({
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
      <header>
        <h1 style={{ margin: 0, fontSize: 26, color: meta.couleurPrimaire }}>
          {data.contact?.nom || "Nom du candidat"}
        </h1>
        <p style={{ margin: "4px 0 0", color: "#5F5E5A" }}>{data.secteur_recherche}</p>
        <ContactLine data={data} textColor="#888780" />
      </header>

      <section style={{ marginTop: 24 }}>
        <SectionTitle color={meta.couleurPrimaire}>Expériences professionnelles</SectionTitle>
        <div style={{ borderLeft: `2px solid ${meta.couleurPrimaire}`, marginLeft: 6, paddingLeft: 20 }}>
          {data.experiences.map((exp, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 18 }}>
              <span
                style={{
                  position: "absolute",
                  left: -26,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: meta.couleurAccent,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <strong>
                  {exp.poste} — {exp.entreprise}
                </strong>
                <span style={{ fontSize: 12, color: "#888780" }}>{exp.dates}</span>
              </div>
              <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                {exp.missions.map((m, j) => (
                  <li key={j} style={{ fontSize: 13 }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
