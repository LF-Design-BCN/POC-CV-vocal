export type TemplateLayout =
  | "classique"
  | "sidebar-gauche"
  | "sidebar-droite"
  | "bandeau"
  | "timeline";

export interface CVTemplateMeta {
  id: string;
  nom: string;
  layout: TemplateLayout;
  couleurPrimaire: string;
  couleurAccent: string;
  police: "serif" | "sans" | "sans-condense";
  tags: string[];
  description: string;
}

// 5 mises en page réellement distinctes, déclinées chacune en 2 versions
// couleur/typographie, pour couvrir large sur les secteurs tout en gardant
// un nombre raisonnable de composants de mise en page à maintenir.
//
// Conventions françaises respectées dans tous les templates : une page,
// ordre Expériences > Formations > Compétences > Centres d'intérêt,
// sobriété par défaut (la couleur reste un accent, jamais envahissante).

export const TEMPLATES: CVTemplateMeta[] = [
  {
    id: "classique-marine",
    nom: "Classique Marine",
    layout: "classique",
    couleurPrimaire: "#1B2A4A",
    couleurAccent: "#3B5788",
    police: "serif",
    tags: ["secteur:finance", "secteur:banque", "secteur:comptabilite", "secteur:administration", "style:sobre"],
    description: "Mise en page traditionnelle une colonne, police serif, bleu marine. Idéal pour les secteurs formels.",
  },
  {
    id: "classique-charbon",
    nom: "Classique Charbon",
    layout: "classique",
    couleurPrimaire: "#2C2C2A",
    couleurAccent: "#5F5E5A",
    police: "serif",
    tags: ["secteur:droit", "secteur:juridique", "secteur:fonction-publique", "style:sobre"],
    description: "Mise en page traditionnelle une colonne, police serif, noir/gris. Très sobre, adapté au droit et au secteur public.",
  },
  {
    id: "sidebar-corail",
    nom: "Sidebar Corail",
    layout: "sidebar-gauche",
    couleurPrimaire: "#C1440E",
    couleurAccent: "#E8663B",
    police: "sans",
    tags: ["secteur:marketing", "secteur:communication", "secteur:evenementiel", "style:moderne"],
    description: "Deux colonnes, bandeau latéral gauche corail. Dynamique, adapté au marketing et à la communication.",
  },
  {
    id: "sidebar-emeraude",
    nom: "Sidebar Émeraude",
    layout: "sidebar-gauche",
    couleurPrimaire: "#0B6E4F",
    couleurAccent: "#3FA980",
    police: "sans",
    tags: ["secteur:rh", "secteur:commercial", "secteur:vente", "style:moderne"],
    description: "Deux colonnes, bandeau latéral gauche vert émeraude. Chaleureux, adapté aux RH et au commercial.",
  },
  {
    id: "sidebar-ardoise",
    nom: "Sidebar Ardoise",
    layout: "sidebar-droite",
    couleurPrimaire: "#37474F",
    couleurAccent: "#607D8B",
    police: "sans-condense",
    tags: ["secteur:ingenierie", "secteur:industrie", "secteur:btp", "style:structure"],
    description: "Deux colonnes, bandeau latéral droit ardoise, police condensée. Structuré, adapté à l'ingénierie et l'industrie.",
  },
  {
    id: "sidebar-indigo",
    nom: "Sidebar Indigo",
    layout: "sidebar-droite",
    couleurPrimaire: "#3949AB",
    couleurAccent: "#7986CB",
    police: "sans",
    tags: ["secteur:tech", "secteur:informatique", "secteur:data", "style:moderne"],
    description: "Deux colonnes, bandeau latéral droit indigo. Moderne, adapté à la tech et à l'informatique.",
  },
  {
    id: "bandeau-corail",
    nom: "Bandeau Corail",
    layout: "bandeau",
    couleurPrimaire: "#E85D4C",
    couleurAccent: "#C1440E",
    police: "sans",
    tags: ["secteur:communication", "secteur:digital", "secteur:evenementiel", "style:dynamique"],
    description: "Bandeau d'en-tête coloré pleine largeur, corail. Impactant, adapté au digital et à l'événementiel.",
  },
  {
    id: "bandeau-bleu",
    nom: "Bandeau Bleu",
    layout: "bandeau",
    couleurPrimaire: "#1976D2",
    couleurAccent: "#0D47A1",
    police: "sans",
    tags: ["secteur:startup", "secteur:produit", "secteur:marketing", "style:dynamique"],
    description: "Bandeau d'en-tête coloré pleine largeur, bleu. Dynamique, adapté aux startups et produits.",
  },
  {
    id: "timeline-violet",
    nom: "Timeline Violet",
    layout: "timeline",
    couleurPrimaire: "#6A4C93",
    couleurAccent: "#9C7BC4",
    police: "sans",
    tags: ["secteur:design", "secteur:ux", "secteur:creatif", "style:original"],
    description: "Expériences présentées en ligne du temps verticale, violet. Original, adapté au design et à l'UX.",
  },
  {
    id: "timeline-graphite",
    nom: "Timeline Graphite",
    layout: "timeline",
    couleurPrimaire: "#4A4A4A",
    couleurAccent: "#8A8A8A",
    police: "sans-condense",
    tags: ["secteur:architecture", "secteur:artistique", "secteur:design", "style:sobre-creatif"],
    description: "Expériences en ligne du temps verticale, graphite. Sobre mais original, adapté à l'architecture et l'artistique.",
  },
];

export const DEFAULT_TEMPLATE_ID = "classique-marine";

export function getTemplateMeta(id: string | null | undefined): CVTemplateMeta {
  return (
    TEMPLATES.find((t) => t.id === id) ??
    TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID) ??
    TEMPLATES[0]
  );
}
