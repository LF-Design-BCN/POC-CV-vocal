import { loadProfile } from "@/lib/store";
import CVTemplate from "@/components/CVTemplate";
import LetterGenerator from "./LetterGenerator";
import PrintButton from "./PrintButton";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const profile = await loadProfile(params.id);

  if (!profile) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <p>
          Profil introuvable pour l'id <code>{params.id}</code>. La
          conversation a-t-elle bien déclenché le webhook ?
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px" }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <PrintButton />
      </div>

      <CVTemplate data={profile} />

      <div style={{ maxWidth: 700, margin: "24px auto 0" }}>
        <LetterGenerator profileId={params.id} />
      </div>
    </main>
  );
}
