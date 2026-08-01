const { generateThreadContent } = require('../services/threspertService');
const { validateGenerateRequest } = require('../validators/threadsValidator');
const { saveGeneration } = require('../repositories/generationsRepository');

// POST /api/threads/generate
// The main "Generate post" action — calls the Threspert AI agent.
async function generate(req, res, next) {
  try {
    const errors = validateGenerateRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(' ') });
    }

    const { deviceId, ...form } = req.body;
    const result = await generateThreadContent(form);

    res.json({ success: true, data: result });

    // Fire-and-forget: don't make the user wait on the history write, and
    // never fail the response if Supabase is slow/unconfigured/down.
    saveGeneration(deviceId, form, result).catch(() => {});
  } catch (err) {
    next(err);
  }
}

module.exports = { generate };
