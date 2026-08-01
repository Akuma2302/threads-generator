const express = require('express');
const { generate } = require('../controllers/threadsController');
const { fetchHistory, deleteHistory } = require('../controllers/historyController');

const router = express.Router();

router.post('/generate', generate);
router.get('/history', fetchHistory);
router.delete('/history', deleteHistory);

module.exports = router;
