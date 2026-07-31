const express = require('express');
const { fetchLink, generate } = require('../controllers/threadsController');

const router = express.Router();

router.post('/fetch-link', fetchLink);
router.post('/generate', generate);

module.exports = router;
