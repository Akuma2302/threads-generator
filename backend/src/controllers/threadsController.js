const { fetchLinkPreview } = require('../services/linkFetcherService');
const { generateThreadContent } = require('../services/hermesService');
const { validateGenerateRequest } = require('../validators/threadsValidator');

// POST /api/threads/fetch-link
// Used by the "🔍 Fetch" button on the Content Source (Affiliate) step.
async function fetchLink(req, res, next) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    const preview = await fetchLinkPreview(url);
    res.json({ success: true, data: preview });
  } catch (err) {
    err.status = err.status || 422;
    if (!err.userMessage) {
      err.message = `Could not fetch that link. It may block automated requests — you can paste the details in manually instead.`;
    }
    next(err);
  }
}

// POST /api/threads/generate
// The main "Generate Threads Content" action — calls the Hermes AI agent.
async function generate(req, res, next) {
  try {
    const errors = validateGenerateRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(' ') });
    }

    // Optional uploaded poster image arrives as base64 from the frontend.
    const { imageBase64, imageMediaType, ...rest } = req.body;

    const result = await generateThreadContent({
      ...rest,
      imageBase64,
      imageMediaType,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { fetchLink, generate };
