# Threads Generator — Frontend

React + Vite frontend for the Threads Content Generator. Matches the 3-step flow: **Content Source → Strategy & Style → Generated Thread**, powered by the Hermes AI agent on the backend.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

Runs at `http://localhost:5173`.

## Folder structure

```
frontend/
  src/
    assets/
    components/    # ContentSourceSection, StrategyStyleSection, OutputSection, pills, etc.
    layout/        # AppShell (top bar + page frame)
    context/       # AppContext — global form state + history
    hooks/         # useThreadsApi — API calls with loading/error state
    services/      # api.js — fetch wrapper
    utils/         # constants.js — pill/dropdown option data
    App.jsx
    main.jsx
    index.css
```

## Deploying to Netlify

1. Push `frontend/` to a Git repo.
2. In Netlify: "Add new site" → "Import an existing project" → point at the repo, base directory `frontend`.
3. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
4. Add environment variable `VITE_API_BASE_URL` pointing at your Render backend URL, e.g. `https://your-backend.onrender.com/api`.

## Notes

- Generation history is stored in the browser's `localStorage` (no backend database yet) so it's per-device.
- Uploaded posters are sent to the backend as base64 and passed to Claude as an image block so the copy can reference what's on the flyer.
