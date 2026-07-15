import type { CVData } from "@/lib/schema";
import type { CVTemplateMeta } from "@/lib/templates";

export function fontStack(police: CVTemplateMeta["police"]) {
  switch (police) {
    case "serif":
      return "Georgia, 'Times New Roman', serif";
    case "sans-condense":
      return "'Arial Narrow', Arial, sans-serif";
    default:
      return "'Helvetica Neue', Arial, sans-serif";
  }
}

export function ExperienceItem({
  exp,
}: {
  exp: CVData["experiences"][number];
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <strong>
          {exp.poste} — {exp.entreprise}
        </strong>
        <span style={{ fontSize: 12, color: "#888780" }}>{exp.dates}</span>
      </div>
      <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
        {exp.missions.map((m, i) => (
          <li key={i} style={{ fontSize: 13 }}>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FormationItem({ f }: { f: CVData["formations"][number] }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, gap: 8 }}>
      <span style={{ fontSize: 13 }}>
        {f.diplome} — {f.etablissement}
      </span>
      <span style={{ fontSize: 12, color: "#888780", whiteSpace: "nowrap" }}>{f.annee}</span>
    </div>
  );
}

export function SectionTitle({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <h2
      style={{
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: 1,
        color,
        borderBottom: `2px solid ${color}`,
        paddingBottom: 4,
        marginBottom: 10,
      }}
    >
      {children}
    </h2>
  );
}

export function CompetencesRow({ data, color }: { data: CVData; color: string }) {
  return (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 140 }}>
        <SectionTitle color={color}>Outils</SectionTitle>
        {data.competences.outils.map((o, i) => (
          <div key={i} style={{ fontSize: 13 }}>
            {o.nom} — {o.niveau}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 140 }}>
        <SectionTitle color={color}>Langues</SectionTitle>
        {data.competences.langues.map((l, i) => (
          <div key={i} style={{ fontSize: 13 }}>
            {l.nom} — {l.niveau}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HobbiesSection({ data, color }: { data: CVData; color: string }) {
  if (data.hobbies.length === 0) return null;
  return (
    <section style={{ marginTop: 20 }}>
      <SectionTitle color={color}>Centres d'intérêt</SectionTitle>
      <p style={{ fontSize: 13 }}>{data.hobbies.join(" · ")}</p>
    </section>
  );
}

export function ContactLine({ data, textColor }: { data: CVData; textColor: string }) {
  return (
    <>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: textColor }}>
        {[data.contact?.telephone, data.contact?.email].filter(Boolean).join(" · ")}
      </p>
      {data.contact?.linkedin && (
        <p style={{ margin: "2px 0 0", fontSize: 13 }}>
          <a
            href={data.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: textColor }}
          >
            {data.contact.linkedin}
          </a>
        </p>
      )}
    </>
  );
}
