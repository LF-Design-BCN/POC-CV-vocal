# CV vocal — POC

## 1. Installer et lancer

```bash
npm install
cp .env.example .env
npm run dev
```

## 2. Stockage (Upstash Redis via Vercel Marketplace)

L'ancien "Vercel KV" a été retiré. Le stockage clé/valeur se fait maintenant
via le Marketplace Vercel :

1. Dans ton projet Vercel : **Storage → Browse Marketplace** (ou l'onglet
   "Marketplace" du dashboard).
2. Cherche **Upstash**, installe l'intégration Redis.
3. Crée une base (ou utilise une existante) et lie-la à ce projet.
4. Vercel injecte automatiquement `UPSTASH_REDIS_REST_URL` et
   `UPSTASH_REDIS_REST_TOKEN` dans les variables d'environnement du projet —
   rien à copier-coller.

En local, pour récupérer ces mêmes variables :
```bash
vercel link
vercel env pull .env.local
```

## 3. Téléphonie réelle (Twilio) : en pause

L'appel téléphonique réel via Twilio nécessite un compte business vérifié
(regulatory bundle) pour obtenir un numéro, ce qui n'est pas encore possible.
En attendant, le POC repose sur le **widget web ElevenLabs** (conversation
dans le navigateur, micro du visiteur). Le code lié à Twilio a été retiré
pour l'instant ; les variables d'environnement correspondantes sont
commentées dans `.env.example` si tu veux reprendre ce chantier plus tard.

## 4. Config de l'agent (prompt, data collection, webhook)

1. **Rédiger le prompt système** de l'agent. Il doit couvrir, dans l'ordre,
   les 6 thématiques : secteur recherché, expériences professionnelles,
   diplômes/formations, compétences (outils + langues), hobbies, coordonnées.
   Prévoir aussi : un ton chaleureux et réactif, un bloc commercial à
   mi-parcours personnalisé selon le profil, et une clôture avec résumé +
   offre exclusive à effet spontané pour les premières fois. Utiliser les
   dynamic variables `{{prenom}}`, `{{nom}}` et `{{linkedin_url}}` (transmises
   depuis le formulaire du site) pour personnaliser le premier message et la
   vérification des coordonnées.
2. **Activer la "Data collection"** (parfois appelée post-call analysis) et
   définir des champs à extraire. Important : ElevenLabs ne propose que des
   types plats (Boolean, Integer, Number, String) — pas d'objets ni de
   tableaux imbriqués. Les champs complexes doivent donc être demandés en
   String contenant du JSON stringifié, qu'on parse ensuite côté webhook.
   Crée exactement ces champs :

   | Identifier | Data type | Description à coller dans ElevenLabs |
   |---|---|---|
   | `secteur_recherche` | String | Le secteur ou poste recherché par le candidat |
   | `contact_nom` | String | Nom complet du candidat |
   | `contact_telephone` | String | Numéro de téléphone du candidat |
   | `contact_email` | String | Adresse email du candidat |
   | `experiences_json` | String | Tableau JSON stringifié de toutes les expériences professionnelles. Chaque élément est un objet avec les clés poste, entreprise, dates, missions (tableau de strings), resultats (tableau de strings). Retourne uniquement du JSON valide, sans texte autour. |
   | `formations_json` | String | Tableau JSON stringifié des formations. Chaque élément est un objet avec diplome, etablissement, annee. Retourne uniquement du JSON valide. |
   | `outils_json` | String | Tableau JSON stringifié des outils/logiciels mentionnés avec niveau. Chaque élément est un objet avec nom, niveau. Retourne uniquement du JSON valide. |
   | `langues_json` | String | Tableau JSON stringifié des langues mentionnées avec niveau. Chaque élément est un objet avec nom, niveau. Retourne uniquement du JSON valide. |
   | `hobbies_json` | String | Tableau JSON stringifié des centres d'intérêt mentionnés (simple liste de strings). Retourne uniquement du JSON valide. |

   Si le modèle d'extraction ne renvoie pas du JSON valide pour un champ,
   notre webhook retombe sur un tableau vide pour ce champ plutôt que de
   tout faire échouer — vérifie les logs pendant la mise au point.
3. **Configurer le webhook post-appel** vers :
   `https://<ton-domaine-vercel>/api/elevenlabs-webhook`
   Renseigne un secret de signature et mets-le dans `ELEVENLABS_WEBHOOK_SECRET`.

Pour tester avant d'avoir déployé sur Vercel, il faut exposer ton
`localhost:3000` publiquement (par exemple avec `ngrok http 3000`) pour
qu'ElevenLabs puisse appeler ton webhook.

⚠️ La structure exacte du payload webhook (noms de champs dans
`analysis.data_collection_results`) peut avoir légèrement changé depuis
l'écriture de ce POC. La première fois, décommente le `console.log` dans
`app/api/elevenlabs-webhook/route.ts` pour voir le payload réel et ajuster
`mapWebhookPayloadToCVData` si besoin.

## 5. Parcours utilisateur du POC

1. `/` — la personne renseigne prénom, nom, téléphone et (optionnel) son
   lien LinkedIn, puis clique sur "Continuer".
2. Elle est redirigée vers `/conversation/<session_id>?prenom=...&nom=...`,
   qui affiche le widget vocal ElevenLabs en mode compact (juste la boule +
   bouton "Démarrer l'appel", sans panneau de transcript). Si le mode
   compact affiche encore les messages, vérifie l'onglet **Widget** de
   l'agent dans le dashboard ElevenLabs pour un réglage d'affichage du
   transcript.
3. Elle clique sur "Démarrer l'appel", autorise le micro, et répond aux
   questions de l'agent.
4. À la fin de la conversation, ElevenLabs POST son analyse sur
   `/api/elevenlabs-webhook`.
5. Le webhook sauvegarde le profil dans Upstash Redis, **puis génère
   automatiquement la lettre de motivation** (ciblée sur le secteur mentionné
   pendant l'appel) et la sauvegarde aussi — sans action manuelle.
6. La personne clique sur "J'ai terminé — voir mon CV" (lien affiché sous le
   widget) pour arriver sur `/result/<session_id>` : elle y voit son CV et
   sa lettre déjà prêts, avec la possibilité de régénérer la lettre en
   ciblant une offre précise.

## 6. Limites volontaires de ce POC

- Un seul template de CV (basique), pas de choix multiple.
- Le lien LinkedIn est simplement stocké/mentionné à l'oral, pas encore
  analysé automatiquement (LinkedIn ne propose pas d'API publique adaptée à
  ça — voir discussion précédente).
- Export "PDF" = impression navigateur, pas de génération PDF côté serveur.
- Pas de vrai appel téléphonique (Twilio en pause, voir section 3) : la
  conversation se fait dans le navigateur.
- Pas de détection automatique de fin d'appel côté navigateur : la personne
  clique elle-même sur le lien "voir mon CV" une fois terminé.

Toutes ces limites sont des choix pour valider vite le principe de bout en
bout ; chacune peut être levée dans une V2 une fois le principe validé.
