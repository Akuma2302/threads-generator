require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterModel: process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free',
  // Comma-separated list of additional models to try, in order, if the
  // primary model's provider errors out or is unavailable. Free-tier models
  // on OpenRouter are prone to transient provider-side outages, so having a
  // few backups means one flaky provider doesn't take the whole app down.
  openrouterFallbackModels: (process.env.OPENROUTER_FALLBACK_MODELS ||
    'meta-llama/llama-3.3-70b-instruct:free,z-ai/glm-4.5-air:free,nvidia/nemotron-3-super-120b-a12b:free'
  )
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean),
  openrouterSiteUrl: process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
  openrouterAppName: process.env.OPENROUTER_APP_NAME || 'Threads Generator',
  clientOrigin: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim())
    : '*',
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 30,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  },
};
