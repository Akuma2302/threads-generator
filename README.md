# Threspert

A tool for content creators, affiliates, and small businesses to turn a short product/topic description into multiple ready-to-post, hook-driven **Threads** (or X/Instagram/TikTok caption) post variations — written by an AI copywriting agent called **Hermes**, backed by a free model on OpenRouter (with automatic fallback to other free models if one's provider hiccups).

## How it works

1. **Mode Penulisan** — choose Post Biasa (informational, no CTA), Post Jualan (sales-focused), or Post Engagement (question/interaction-focused).
2. **Post Details** — describe what the post is about, pick platform/caption language/length, how many post variations to generate, how many connected thread parts per post, one or more hook types to blend (Curiosity, Bold Statement, Negative/Reverse, Controversy Spike, etc.), and an optional product link.
3. **Generated Posts** — each variation shows its blended hook type, a standalone Hook block, and the Full Post thread — every part individually copyable.

## Project structure

```
app/
  backend/    # Node.js + Express API, calls a model via OpenRouter (OpenAI-compatible)
  frontend/   # React + Vite UI
```

See `backend/README.md` and `frontend/README.md` for setup and deployment instructions specific to each half.

## Quick start (local dev)

```bash
# Terminal 1
cd backend
npm install
cp .env.example .env   # add your OPENROUTER_API_KEY (free at openrouter.ai/keys)
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
