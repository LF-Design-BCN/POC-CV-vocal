import type { CVData } from "@/lib/schema";

function dateAujourdhui() {
  return new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function LettreTemplate({
  corps,
  profile,
}: {
  corps: string;
  profile: CVData;
}) {
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
        lineHeight: 1.7,
      }}
    >
      <div style={{ fontSize: 13 }}>
        {profile.contact?.nom && <div>{profile.contact.nom}</div>}
        {profile.contact?.telephone && <div>{profile.contact.telephone}</div>}
        {profile.contact?.email && <div>{profile.contact.email}</div>}
      </div>

      <div style={{ textAlign: "right", fontSize: 13, marginTop: 24 }}>Le {dateAujourdhui()}</div>

      <div style={{ marginTop: 24, fontSize: 13, fontWeight: "bold" }}>
        Objet : Candidature{profile.secteur_recherche ? ` — ${profile.secteur_recherche}` : ""}
      </div>

      <p style={{ marginTop: 24, marginBottom: 0 }}>Madame, Monsieur,</p>

      <div style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{corps}</div>

      <p style={{ marginTop: 24, marginBottom: 4 }}>Cordialement,</p>
      {profile.contact?.nom && <p>{profile.contact.nom}</p>}
    </div>
  );
}
