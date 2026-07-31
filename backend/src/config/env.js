require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterModel: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free',
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
