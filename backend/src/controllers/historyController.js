const { getHistory, clearHistory } = require('../repositories/generationsRepository');

// GET /api/threads/history?deviceId=...
async function fetchHistory(req, res, next) {
  try {
    const { deviceId } = req.query;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'deviceId query param is required' });
    }

    const history = await getHistory(deviceId);
    res.json({ success: true, data: { history } });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/threads/history?deviceId=...
async function deleteHistory(req, res, next) {
  try {
    const { deviceId } = req.query;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'deviceId query param is required' });
    }

    await clearHistory(deviceId);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

module.exports = { fetchHistory, deleteHistory };
