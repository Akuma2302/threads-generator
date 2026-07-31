# Threads Generator

A tool for content creators, affiliates, and small businesses to turn a messy product link or a raw brain-dump into ready-to-post **Threads** content — written by an AI copywriting agent called **Hermes** (Claude).

## How it works

1. **Content Source** — choose `Affiliate` (paste a product link, auto-fetch its title/price/description) or `Organic` (pick a sub-type — Service, Event, Personal Life, Volunteer, Business — and dump your raw notes, optionally with a reference link or poster/image upload).
2. **Strategy & Style** — pick a storytelling angle (Honest Review, Comparison, FOMO/Urgency, etc.), an optional viral formula overlay (POV, Hot Take, PSA...), thread length, audience, and language.
3. **Generated Thread** — Hermes writes the full multi-post thread, each post copyable individually or all at once, with an optional suggested first comment for the link/CTA.

## Project structure

```
app/
  backend/    # Node.js + Express API, calls Claude via @anthropic-ai/sdk
  frontend/   # React + Vite UI
```

See `backend/README.md` and `frontend/README.md` for setup and deployment instructions specific to each half.

## Quick start (local dev)

```bash
# Terminal 1
cd backend
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm run dev

# Terminal 2
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open `http://localhost:5173`.

## Deployment

- **Frontend → Netlify** (see `frontend/netlify.toml`)
- **Backend → Render** (see `backend/render.yaml`)

Remember to set `CLIENT_ORIGIN` on the backend to your Netlify URL, and `VITE_API_BASE_URL` on the frontend to your Render backend URL + `/api`.
