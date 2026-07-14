# CV vocal — POC

## 1. Installer et lancer

```bash
npm install
cp .env.example .env
npm run dev
```

## 2. Config côté ElevenLabs (dans leur dashboard, pas dans ce repo)

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
   définir un schéma de champs à extraire qui correspond à `lib/schema.ts`
   dans ce projet (secteur_recherche, experiences, formations, competences,
   hobbies, contact). C'est ce qui permet à ElevenLabs de te renvoyer un JSON
   structuré à la fin de l'appel plutôt qu'un simple transcript.
4. **Configurer le webhook post-appel** vers :
   `https://<ton-domaine-ou-tunnel-ngrok>/api/elevenlabs-webhook`
   Renseigne un secret de signature et mets-le dans `ELEVENLABS_WEBHOOK_SECRET`.
5. Récupère l'**Agent ID** et mets-le dans `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`.

Pour tester en local, il faut exposer ton `localhost:3000` publiquement
(par exemple avec `ngrok http 3000`) pour qu'ElevenLabs puisse appeler ton
webhook.

⚠️ La structure exacte du payload webhook (noms de champs dans
`analysis.data_collection_results`, endroit où passent tes dynamic variables)
peut avoir légèrement changé depuis l'écriture de ce POC. La première fois,
décommente le `console.log` dans
`app/api/elevenlabs-webhook/route.ts` pour voir le payload réel et ajuster
`mapWebhookPayloadToCVData` si besoin. Doc à jour :
https://elevenlabs.io/docs/conversational-ai/workflows/post-call-webhooks

## 3. Parcours utilisateur du POC

1. `/` — la personne clique sur le widget vocal et répond aux questions.
2. À la fin de l'appel, ElevenLabs POST son analyse sur
   `/api/elevenlabs-webhook`, qui sauvegarde un profil JSON dans `.data/`.
3. La personne est redirigée (à faire : rediriger automatiquement depuis le
   widget une fois l'appel terminé, ou lui donner le lien) vers
   `/result/<session_id>`.
4. Cette page affiche le CV généré à partir du template fixe, avec un bouton
   pour générer la lettre de motivation via Claude.

## 4. Limites volontaires de ce POC

- Un seul template de CV, pas de choix multiple.
- Pas d'import LinkedIn.
- Stockage en fichiers JSON locaux, pas de vraie base de données.
- Export "PDF" = impression navigateur, pas de génération PDF côté serveur.
- Pas de vrai appel téléphonique (Twilio) : le widget tourne dans le
  navigateur.

Toutes ces limites sont des choix pour valider vite le principe de bout en
bout ; chacune peut être levée dans une V2 une fois la conversation vocale
validée.
