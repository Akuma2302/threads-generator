# Threspert — Backend (Hermes agent)

Express API that powers Threspert. It talks to a model on **OpenRouter** (the "Hermes" copywriting agent — currently the free `google/gemma-4-31b-it:free` model, with automatic fallback to other free models) to turn a short description into multiple ready-to-post hook-driven thread variations.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in OPENROUTER_API_KEY
npm run dev
```

Get a free `OPENROUTER_API_KEY` at [openrouter.ai/keys](https://openrouter.ai/keys) — no credit card needed for free-tier models.

### Model fallback

`OPENROUTER_MODEL` is tried first; if its provider errors out (common with free-tier models), the service automatically retries each model listed in `OPENROUTER_FALLBACK_MODELS` (comma-separated) in order, so one flaky free model doesn't take the whole app down.

Swap in the real Nous Research Hermes 4 anytime (paid, cheap) by setting `OPENROUTER_MODEL=nousresearch/hermes-4-70b`.

## Endpoints

### `GET /api/health`
Simple uptime check.

### `POST /api/threads/generate`
Calls the Threspert AI agent to generate post variations.

```json
{
  "mode": "post_jualan",
  "postAbout": "Tyeso 650ml tumbler — kekal sejuk 12 jam",
  "platform": "Threads",
  "captionLanguage": "Bahasa Melayu",
  "length": "Panjang",
  "postCount": 5,
  "threadPerPost": 5,
  "hookTypes": ["curiosity", "bold_statement", "negative_reverse", "controversy_spike"],
  "productLink": "https://shopee.com.my/product/..."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "variations": [
      {
        "hookType": "negative_reverse",
        "hook": "JANGAN beli Tyeso 650ml ni kalau kau suka membazir duit setiap hari.",
        "parts": ["post 1 (hook)", "post 2...", "post 3...", "post 4...", "post 5..."]
      }
    ]
  }
}
```

`variations` will contain exactly `postCount` items, each with exactly `threadPerPost` parts.

## Deploying to Render

This repo includes a `render.yaml`. Push `backend/` to a Git repo, create a new Render Web Service from it, and set `OPENROUTER_API_KEY` and `CLIENT_ORIGIN` (your Netlify URL) in the Render dashboard.

## Folder structure

```
backend/
  src/
    config/       # env loading
    controllers/   # request handlers
    routes/        # API route definitions
    services/      # Hermes (OpenRouter) generation logic
    middlewares/    # error handling
    models/        # reserved for future DB-backed history
    repositories/   # reserved for future DB-backed history
    utils/         # prompt builder
    validators/     # request validation
  .env.example
  package.json
```
