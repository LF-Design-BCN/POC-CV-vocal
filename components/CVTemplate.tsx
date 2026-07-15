import type { CVData } from "@/lib/schema";

export default function CVTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        background: "white",
        maxWidth: 700,
        margin: "0 auto",
        padding: 40,
        border: "1px solid #E5E3DA",
        fontFamily: "Georgia, serif",
        color: "#2C2C2A",
      }}
    >
      <header style={{ borderBottom: "2px solid #2C2C2A", paddingBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>
          {data.contact?.nom || "Nom du candidat"}
        </h1>
        <p style={{ margin: "4px 0 0", color: "#5F5E5A" }}>
          {data.secteur_recherche}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888780" }}>
          {[data.contact?.telephone, data.contact?.email]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {data.contact?.linkedin && (
          <p style={{ margin: "2px 0 0", fontSize: 13 }}>
            <a
              href={data.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5F5E5A" }}
            >
              {data.contact.linkedin}
            </a>
          </p>
        )}
      </header>

      {data.resume_profil && (
        <section style={{ marginTop: 20 }}>
          <p style={{ fontStyle: "italic", color: "#444441" }}>
            {data.resume_profil}
          </p>
        </section>
      )}

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 1 }}>
          Expériences professionnelles
        </h2>
        {data.experiences.map((exp, i) => (
          <div key={i} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>
                {exp.poste} — {exp.entreprise}
              </strong>
              <span style={{ color: "#888780", fontSize: 13 }}>{exp.dates}</span>
            </div>
            <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
              {exp.missions.map((m, j) => (
                <li key={j} style={{ fontSize: 14 }}>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 1 }}>
          Formations
        </h2>
        {data.formations.map((f, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span>
              {f.diplome} — {f.etablissement}
            </span>
            <span style={{ color: "#888780", fontSize: 13 }}>{f.annee}</span>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 24, display: "flex", gap: 40 }}>
        <div>
          <h2 style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Outils
          </h2>
          {data.competences.outils.map((o, i) => (
            <div key={i} style={{ fontSize: 14 }}>
              {o.nom} — {o.niveau}
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Langues
          </h2>
          {data.competences.langues.map((l, i) => (
            <div key={i} style={{ fontSize: 14 }}>
              {l.nom} — {l.niveau}
            </div>
          ))}
        </div>
      </section>

      {data.hobbies.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Centres d'intérêt
          </h2>
          <p style={{ fontSize: 14 }}>{data.hobbies.join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
