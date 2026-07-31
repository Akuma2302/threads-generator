# Threads Generator — Backend (Hermes agent)

Express API that powers the Threads Generator. It talks to Claude (the "Hermes" copywriting agent) to turn raw notes, affiliate links, or event/business info into ready-to-post Threads content.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Endpoints

### `GET /api/health`
Simple uptime check.

### `POST /api/threads/fetch-link`
Scrapes basic product metadata (title, description, price, image) from an affiliate link so the creator doesn't have to retype it.

```json
{ "url": "https://shopee.com.my/product/..." }
```

### `POST /api/threads/generate`
Calls Hermes (Claude) to generate the thread.

```json
{
  "contentSource": "organic",
  "subType": "event",
  "coreContext": "Hosting a free resume review session on Google Meet this Saturday 8pm.",
  "contextLink": "",
  "affiliateLink": "",
  "strategy": { "angle": "fomo_urgency", "viralFormula": "psa" },
  "threadLength": "4 Posts (Standard)",
  "audience": "Girls",
  "audienceDetail": "office ladies, career switchers",
  "language": "Bahasa Melayu",
  "imageBase64": null,
  "imageMediaType": null
}
```

Response:

```json
{
  "success": true,
  "data": {
    "posts": ["post 1...", "post 2...", "post 3...", "post 4..."],
    "suggestedFirstComment": "Link ada kat sini 👇"
  }
}
```

## Deploying to Render

This repo includes a `render.yaml`. Push `backend/` to a Git repo, create a new Render Web Service from it, and set the `ANTHROPIC_API_KEY` and `CLIENT_ORIGIN` (your Netlify URL) environment variables in the Render dashboard.

## Folder structure

```
backend/
  src/
    config/       # env loading
    controllers/   # request handlers
    routes/        # API route definitions
    services/      # Hermes (Claude) + link scraping business logic
    middlewares/    # error handling, uploads
    models/        # reserved for future DB-backed history
    repositories/   # reserved for future DB-backed history
    utils/         # prompt builder
    validators/     # request validation
  .env.example
  package.json
```
