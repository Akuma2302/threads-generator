const express = require('express');
const threadsRoutes = require('./threadsRoutes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));
router.use('/threads', threadsRoutes);

module.exports = router;
