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

## 3. Config côté ElevenLabs (dans leur dashboard, pas dans ce repo)

Cette partie ne se code pas ici : elle se configure dans ton compte ElevenLabs,
section "Conversational AI".

1. **Créer un agent.**
2. **Rédiger le prompt système** de l'agent. Il doit couvrir, dans l'ordre,
   les 4 thématiques : secteur recherché, expériences professionnelles,
   diplômes/formations, compétences (outils + langues) et hobbies. Donne-lui
   pour instruction de reformuler et de relancer si une réponse est vague
   ("tu as dit avoir géré une équipe, combien de personnes ?"), et de ne pas
   couper la parole trop vite.
3. **Activer la "Data collection"** (parfois appelée post-call analysis) et
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

   C'est ce qui permet à ElevenLabs de te renvoyer des données structurées
   à la fin de l'appel plutôt qu'un simple transcript. Si le modèle
   d'extraction ne renvoie pas du JSON valide pour un champ, notre webhook
   retombe sur un tableau vide pour ce champ plutôt que de tout faire
   échouer — vérifie les logs pendant la mise au point pour repérer ces cas.
4. **Configurer le webhook post-appel** vers :
   `https://<ton-domaine-vercel>/api/elevenlabs-webhook`
   Renseigne un secret de signature et mets-le dans `ELEVENLABS_WEBHOOK_SECRET`.
5. Récupère l'**Agent ID** et mets-le dans `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`.

Pour tester avant d'avoir déployé sur Vercel, il faut exposer ton
`localhost:3000` publiquement (par exemple avec `ngrok http 3000`) pour
qu'ElevenLabs puisse appeler ton webhook.

⚠️ La structure exacte du payload webhook (noms de champs dans
`analysis.data_collection_results`, endroit où passent tes dynamic variables)
peut avoir légèrement changé depuis l'écriture de ce POC. La première fois,
décommente le `console.log` dans
`app/api/elevenlabs-webhook/route.ts` pour voir le payload réel et ajuster
`mapWebhookPayloadToCVData` si besoin. Doc à jour :
https://elevenlabs.io/docs/conversational-ai/workflows/post-call-webhooks

## 4. Parcours utilisateur du POC

1. `/` — la personne clique sur le widget vocal et répond aux questions.
2. À la fin de l'appel, ElevenLabs POST son analyse sur
   `/api/elevenlabs-webhook`, qui sauvegarde un profil dans Upstash Redis.
3. La personne est redirigée (à faire : rediriger automatiquement depuis le
   widget une fois l'appel terminé, ou lui donner le lien) vers
   `/result/<session_id>`.
4. Cette page affiche le CV généré à partir du template fixe, avec un bouton
   pour générer la lettre de motivation via Claude.

## 5. Limites volontaires de ce POC

- Un seul template de CV, pas de choix multiple.
- Pas d'import LinkedIn.
- Export "PDF" = impression navigateur, pas de génération PDF côté serveur.
- Pas de vrai appel téléphonique (Twilio) : le widget tourne dans le
  navigateur.

Toutes ces limites sont des choix pour valider vite le principe de bout en
bout ; chacune peut être levée dans une V2 une fois la conversation vocale
validée.
