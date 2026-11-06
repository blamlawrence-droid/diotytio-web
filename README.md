# Diotytio Web

Application React/Vite avec une API Express déployée dans une fonction Netlify et une base PostgreSQL gérée par Netlify Database.

## Installation et développement

Node.js 22.12 ou supérieur est requis.

```bash
npm install
netlify dev --port 8889
```

Ouvrir http://localhost:8889. Cette commande lance Vite et les fonctions locales avec la configuration Netlify du projet. `npm run dev` lance uniquement le frontend ; les appels `/api` nécessitent Netlify Dev. `npm run server` lance l'API Express seule sur le port 3001 dans un environnement où la connexion Netlify Database est disponible.

## Base de données et déploiement

Le schéma est défini dans `db/schema.ts`. La connexion utilise `@netlify/database` et Drizzle, sans variable `DATABASE_URL` à fournir manuellement.

Après une modification du schéma, générer une migration :

```bash
npm run db:generate -- --name describe_schema_change
```

Les migrations de `netlify/database/migrations` sont appliquées automatiquement par Netlify pendant le déploiement. Ne pas appliquer les anciennes migrations Prisma : le dossier `prisma` reste une référence de l'ancien schéma et ne pilote plus l'application. Sur une base neuve, les parcours utilisant les tables deviennent disponibles après le premier déploiement et ses migrations. `/api/health` vérifie la connexion à la base.

Le frontend est publié depuis `dist`. Les routes `/api/*` sont traitées par la fonction `api` ; les autres routes sont servies par React Router, y compris lors d'un rechargement direct.

## Configuration des services

Configurer `ADMIN_PHONE` (format international) et `ADMIN_PASSWORD` dans l'environnement Netlify pour activer le compte administrateur. Le mot de passe doit comporter au moins huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial. L'administrateur définit le numéro Flooz dans l'interface et valide les demandes de dépôt et de retrait.

Le parcours principal utilise des demandes de dépôt Flooz et de retrait validées manuellement. Les anciens endpoints de paiement GeniusPay nécessitent `GENIUSPAY_API_KEY`, `GENIUSPAY_API_SECRET`, ainsi que `WEBHOOK_SECRET` pour la vérification des notifications. Ils renvoient une erreur explicite si le service n'est pas configuré. Le webhook existant ne crédite pas automatiquement les comptes ; une intégration complète du rapprochement des paiements reste nécessaire avant d'activer ce parcours. Les versements directs sont désactivés au profit des demandes de retrait qui réservent le solde.

## Vérification

```bash
npm run lint
npm test
```

Les tests couvrent les réponses de l'API, la validation des requêtes et les protections des opérations financières. Les parcours avec une base réelle sont à vérifier après l'application automatique des migrations au déploiement.
