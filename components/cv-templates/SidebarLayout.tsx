import type { CVData } from "@/lib/schema";
import type { CVTemplateMeta } from "@/lib/templates";
import { fontStack, ExperienceItem, FormationItem, SectionTitle } from "./shared";

export default function SidebarLayout({
  data,
  meta,
}: {
  data: CVData;
  meta: CVTemplateMeta;
}) {
  const sideOnRight = meta.layout === "sidebar-droite";

  const sidebar = (
    <div
      style={{
        background: meta.couleurPrimaire,
        color: "white",
        padding: 24,
        width: 220,
        flexShrink: 0,
      }}
    >
      <h1 style={{ fontSize: 20, margin: 0 }}>{data.contact?.nom || "Nom du candidat"}</h1>
      <p style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{data.secteur_recherche}</p>

      <div style={{ marginTop: 20, fontSize: 12, lineHeight: 1.6 }}>
        {data.contact?.telephone && <div>{data.contact.telephone}</div>}
        {data.contact?.email && <div>{data.contact.email}</div>}
        {data.contact?.linkedin && (
          <div>
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
              {data.contact.linkedin}
            </a>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
            borderBottom: "1px solid rgba(255,255,255,0.4)",
            paddingBottom: 4,
          }}
        >
          Outils
        </h2>
        {data.competences.outils.map((o, i) => (
          <div key={i} style={{ fontSize: 12, marginTop: 4 }}>
            {o.nom} — {o.niveau}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
            borderBottom: "1px solid rgba(255,255,255,0.4)",
            paddingBottom: 4,
          }}
        >
          Langues
        </h2>
        {data.competences.langues.map((l, i) => (
          <div key={i} style={{ fontSize: 12, marginTop: 4 }}>
            {l.nom} — {l.niveau}
          </div>
        ))}
      </div>

      {data.hobbies.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              borderBottom: "1px solid rgba(255,255,255,0.4)",
              paddingBottom: 4,
            }}
          >
            Centres d'intérêt
          </h2>
          <p style={{ fontSize: 12, marginTop: 4 }}>{data.hobbies.join(", ")}</p>
        </div>
      )}
    </div>
  );

  const main = (
    <div style={{ padding: 32, flex: 1, minWidth: 0 }}>
      {data.resume_profil && (
        <p style={{ fontStyle: "italic", color: "#444441", marginTop: 0 }}>{data.resume_profil}</p>
      )}

      <section>
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
    </div>
  );

  return (
    <div
      style={{
        background: "white",
        maxWidth: 760,
        margin: "0 auto",
        border: "1px solid #E5E3DA",
        fontFamily: fontStack(meta.police),
        color: "#2C2C2A",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: sideOnRight ? "row-reverse" : "row",
      }}
    >
      {sidebar}
      {main}
    </div>
  );
}
