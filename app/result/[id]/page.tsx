import { loadProfile, loadLetter, loadSelectedTemplate } from "@/lib/store";
import { DEFAULT_TEMPLATE_ID } from "@/lib/templates";
import ResultView from "./ResultView";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const profile = await loadProfile(params.id);
  const lettreInitiale = await loadLetter(params.id);
  const selectedTemplateId = await loadSelectedTemplate(params.id);

  if (!profile) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <p>
          Profil introuvable pour l'id <code>{params.id}</code>. L'appel a-t-il
          bien eu lieu et déclenché le webhook ? Ça peut aussi prendre
          quelques secondes après la fin de l'appel — rafraîchissez la page.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px" }}>
      <ResultView
        profileId={params.id}
        profile={profile}
        lettreInitiale={lettreInitiale}
        initialTemplateId={selectedTemplateId ?? DEFAULT_TEMPLATE_ID}
      />
    </main>
  );
}
