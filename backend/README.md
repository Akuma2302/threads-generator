# Threads Generator — Backend (Hermes agent)

Express API that powers the Threads Generator. It talks to a model on **OpenRouter** (the "Hermes" copywriting agent — currently the free `openai/gpt-oss-120b:free` model) to turn raw notes, affiliate links, or event/business info into ready-to-post Threads content.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in OPENROUTER_API_KEY
npm run dev
```

Get a free `OPENROUTER_API_KEY` at [openrouter.ai/keys](https://openrouter.ai/keys) — no credit card needed for the free-tier model.

### Swapping models

Change `OPENROUTER_MODEL` in `.env` to point at any model OpenRouter serves — no code changes needed:

- `openai/gpt-oss-120b:free` — default, $0
- `google/gemma-4-31b-it:free` — also free
- `nousresearch/hermes-4-70b` — the real Hermes 4 model, paid but cheap (~$0.13/M input tokens)
- `nousresearch/hermes-4-405b` — larger Hermes 4, higher quality, paid

Note: most free-tier models don't accept image input, so uploaded posters are only used for their filename as text context. Paid vision-capable models (including OpenAI's own vision models) will use the actual image if you set `enableVisionInput: true` in the request.

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

This repo includes a `render.yaml`. Push `backend/` to a Git repo, create a new Render Web Service from it, and set the `OPENROUTER_API_KEY` and `CLIENT_ORIGIN` (your Netlify URL) environment variables in the Render dashboard.

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
