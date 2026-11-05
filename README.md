# Diotytio Web

Application web de gestion de compte, dépôts/retraits mobile money, achats de produits et tâches quotidiennes.

## Stack

- **Frontend** : React 19, Vite, Tailwind, Zustand, React Router
- **Backend** : Node.js, Express 5, Prisma
- **Base de données** : PostgreSQL 16 (Docker)

## Prérequis

- Node.js 20+
- Docker et Docker Compose

## Installation

```bash
npm install
cp .env.example .env
# Renseignez les valeurs dans .env
```

## Base de données

```bash
docker compose up -d
npm run db:generate
npm run db:deploy
```

## Développement

```bash
npm run dev
```

- Frontend : http://localhost:5173
- API : http://localhost:3001

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance l'API et Vite en mode développement |
| `npm run server` | Lance uniquement l'API |
| `npm run build` | Build de production du frontend |
| `npm run lint` | Analyse du code |
| `npm run db:migrate` | Crée/applique une migration Prisma |
| `npm run db:deploy` | Applique les migrations en production |
| `npm run db:studio` | Ouvre Prisma Studio |

## Variables d'environnement

Voir `.env.example`. Ne jamais committer le fichier `.env`.

Variables principales :

- `DATABASE_URL` : URL PostgreSQL
- `ADMIN_PHONE` / `ADMIN_PASSWORD` : compte administrateur créé au démarrage
- `ALLOWED_ORIGINS` : origines CORS autorisées
- `GENIUSPAY_API_KEY` / `GENIUSPAY_API_SECRET` : clés de paiement
- `WEBHOOK_SECRET` : secret de vérification des webhooks

## Structure

```
src/         Frontend React
server/      API Express
prisma/      Schéma et migrations PostgreSQL
public/      Assets statiques
```
