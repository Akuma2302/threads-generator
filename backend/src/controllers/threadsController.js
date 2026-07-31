const { generateThreadContent } = require('../services/threspertService');
const { validateGenerateRequest } = require('../validators/threadsValidator');

// POST /api/threads/generate
// The main "Generate post" action — calls the Threspert AI agent.
async function generate(req, res, next) {
  try {
    const errors = validateGenerateRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(' ') });
    }

    const result = await generateThreadContent(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate };
