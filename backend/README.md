# Threspert — Backend

Express API that powers Threspert. It talks to a model on **OpenRouter** (currently the free `google/gemma-4-31b-it:free` model, with automatic fallback to other free models) to turn a short description into multiple ready-to-post hook-driven thread variations, and optionally persists generation history to **Supabase**, scoped per anonymous device.

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

## Setting up Supabase (optional — for persistent history)

Without this, generation still works exactly the same, it just won't remember history across sessions/devices. To enable it:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to the **SQL Editor** and run:

```sql
create table generations (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  form jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index idx_generations_device_id on generations (device_id);

-- Row Level Security is enabled with NO policies, which locks the table
-- down to the service role key only. The backend is the only thing that
-- ever talks to Supabase (the frontend never does), and it filters every
-- query by device_id manually, so each anonymous device only ever sees
-- its own rows.
alter table generations enable row level security;
```

3. In Supabase: **Settings → API**, copy the **Project URL** and the **service_role** key (not the `anon` key).
4. Put them in `backend/.env` as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, and add the same to Render's environment variables when you deploy.

### How "per-user" history works without login

There's no login system. The frontend generates a random ID the first time someone opens the app and stores it in the browser's `localStorage`. That ID is sent with every generate/history request, and every Supabase query is filtered by it (`WHERE device_id = ...`). This means:

- History is tied to a browser/device, not an account — clearing browser storage or switching devices starts a fresh history.
- It's not cryptographically secure identity — someone could technically forge another device's ID if they knew it — but for a lightweight per-device history feature (not sensitive data), this is a reasonable tradeoff to avoid building a full auth system. Ask me anytime if you'd rather add real accounts (Supabase Auth) instead.

## Endpoints

### `GET /api/health`
Simple uptime check.

### `POST /api/threads/generate`
Calls the Threspert AI agent to generate post variations. Include `deviceId` in the body to have it saved to history (omit it and generation still works, it just won't be saved).

```json
{
  "mode": "post_jualan",
  "postAbout": "Tyeso 650ml tumbler — kekal sejuk 12 jam",
  "platform": "Threads",
  "captionLanguage": "Bahasa Melayu",
  "length": "Panjang",
  "audience": "Students 🎓",
  "postCount": 1,
  "threadPerPost": 5,
  "hookTypes": ["negative_reverse"],
  "productLink": "https://shopee.com.my/product/...",
  "deviceId": "a1b2c3d4-..."
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

### `GET /api/threads/history?deviceId=...`
Returns this device's saved generations, newest first (empty array if Supabase isn't configured).

### `DELETE /api/threads/history?deviceId=...`
Deletes all history rows for this device only.

## Deploying to Render

This repo includes a `render.yaml`. Push `backend/` to a Git repo, create a new Render Web Service from it, and set `OPENROUTER_API_KEY`, `CLIENT_ORIGIN` (your Netlify URL), and optionally `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in the Render dashboard.

## Folder structure

```
backend/
  src/
    config/         # env loading
    controllers/    # request handlers
    routes/         # API route definitions
    services/       # Threspert (OpenRouter) generation logic + Supabase client
    middlewares/    # error handling
    models/         # reserved for future use
    repositories/   # Supabase data access (generationsRepository)
    utils/          # prompt builder
    validators/     # request validation
  .env.example
  package.json
```
