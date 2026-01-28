# Twilio WhatsApp Bot avec Express TypeScript

Bot WhatsApp simple utilisant Twilio et Express.js avec TypeScript. Le bot répond avec un echo des messages reçus.

## 🚀 Fonctionnalités

- Réception de messages WhatsApp via webhooks Twilio
- Bot echo qui répond automatiquement aux messages
- Logging détaillé pour debugging
- Support des status callbacks Twilio
- Configuration pour déploiement sur Render
- Validation de signature Twilio (optionnelle)

## 📋 Prérequis

- Node.js 18+ et pnpm
- Compte Twilio avec WhatsApp activé
- Numéro WhatsApp Twilio (déjà configuré: `+15558706149`)

## 🛠️ Installation locale

1. **Cloner le projet et installer les dépendances**

```bash
pnpm install
```

2. **Configurer les variables d'environnement**

Copiez `.env.example` vers `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

Éditez `.env` avec vos identifiants Twilio :

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15558706149
PORT=3000
TWILIO_WEBHOOK_SECRET=your_webhook_secret_here  # Optionnel
```

3. **Démarrer en mode développement**

```bash
pnpm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 🌐 Déploiement sur Render

### Étape 1 : Préparer le projet

1. Assurez-vous que votre code est poussé sur GitHub/GitLab/Bitbucket
2. Vérifiez que `render.yaml` est présent à la racine du projet

### Étape 2 : Créer le service sur Render

1. Connectez-vous à [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository
4. Render détectera automatiquement `render.yaml` ou vous pouvez configurer manuellement :
   - **Name**: `twilio-whatsapp-bot`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `node dist/server.js`
   - **Plan**: Choisissez votre plan (Free disponible)

### Étape 3 : Configurer les variables d'environnement

Dans la section "Environment" du service Render, ajoutez :

```
TWILIO_ACCOUNT_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_PHONE_NUMBER=+15558706149
PORT=10000
NODE_ENV=production
TWILIO_WEBHOOK_SECRET=votre_webhook_secret  # Optionnel mais recommandé
```

### Étape 4 : Obtenir l'URL de votre service

Une fois déployé, Render vous donnera une URL comme : `https://twilio-whatsapp-bot.onrender.com`

### Étape 5 : Configurer le webhook dans Twilio Console

1. Allez dans [Twilio Console](https://console.twilio.com)
2. Naviguez vers **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Ou allez dans **Messaging** → **Settings** → **WhatsApp Sandbox** (pour le sandbox)
4. Configurez le webhook :
   - **Webhook URL for incoming messages**: `https://votre-app.onrender.com/webhooks/whatsapp`
   - **Webhook Method**: `HTTP Post`
   - **Status callback URL**: `https://votre-app.onrender.com/webhooks/whatsapp/status`
   - **Status callback Method**: `HTTP Post`

### Étape 6 : Tester

Envoyez un message WhatsApp à votre numéro Twilio (`+15558706149`) et vous devriez recevoir une réponse echo !

## 📝 Scripts disponibles

- `pnpm run dev` - Démarre le serveur en mode développement avec hot-reload
- `pnpm run build` - Compile le TypeScript en JavaScript
- `pnpm start` - Démarre le serveur en production (utilise les fichiers compilés)
- `pnpm run type-check` - Vérifie les types TypeScript sans compiler

## 🔍 Endpoints

- `GET /` - Page d'accueil avec informations sur l'API
- `GET /health` - Health check endpoint
- `POST /webhooks/whatsapp` - Webhook pour recevoir les messages WhatsApp
- `POST /webhooks/whatsapp/status` - Callback pour les statuts de livraison

## 📊 Logs

Les logs sont affichés dans la console et sont visibles :

- **Localement** : Dans votre terminal
- **Sur Render** : Dans la section "Logs" de votre service Render
- **Dans Twilio Console** : Via les logs de webhook dans la section "Monitor"

## 🔒 Sécurité

- La validation de signature Twilio est implémentée mais optionnelle
- Configurez `TWILIO_WEBHOOK_SECRET` pour activer la validation
- Le secret se trouve dans votre Twilio Console sous "Messaging" → "Settings" → "WhatsApp Sandbox" → "Webhook URL"

## 🐛 Debugging

Pour voir les logs détaillés :

1. **Localement** : Les logs apparaissent dans votre terminal
2. **Sur Render** : Allez dans "Logs" de votre service
3. **Dans Twilio Console** : Vérifiez les logs de webhook dans "Monitor" → "Logs" → "Messaging"

Les logs incluent :

- Les headers de chaque requête
- Le body complet des webhooks
- Les messages entrants et sortants
- Les erreurs avec stack traces

## 📚 Structure du projet

```
.
├── src/
│   ├── server.ts              # Point d'entrée Express
│   ├── routes/
│   │   └── webhooks.ts        # Routes webhook Twilio
│   ├── services/
│   │   └── twilio.service.ts  # Service Twilio
│   └── types/
│       └── twilio.types.ts    # Types TypeScript
├── src/
│   └── config/
│       └── env.ts             # Configuration environnement
├── dist/                      # Fichiers compilés (généré)
├── .env.example               # Template variables d'environnement
├── render.yaml                # Configuration Render
├── tsconfig.json              # Configuration TypeScript
└── package.json               # Dépendances
```

## 🆘 Dépannage

### Le bot ne répond pas

1. Vérifiez que le webhook est correctement configuré dans Twilio Console
2. Vérifiez les logs sur Render pour voir si les requêtes arrivent
3. Vérifiez que les variables d'environnement sont correctement configurées
4. Assurez-vous que votre numéro WhatsApp est autorisé dans Twilio (sandbox ou approuvé)

### Erreur "Signature invalide"

- Si vous avez configuré `TWILIO_WEBHOOK_SECRET`, vérifiez qu'il correspond au secret dans Twilio Console
- Vous pouvez temporairement retirer cette variable pour tester (non recommandé en production)

### Port déjà utilisé

- Changez le `PORT` dans votre `.env` ou dans les variables d'environnement Render

## 📄 Licence

ISC
