require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
  clientOrigin: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim())
    : '*',
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 30,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  },
};
