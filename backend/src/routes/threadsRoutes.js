const express = require('express');
const { generate } = require('../controllers/threadsController');

const router = express.Router();

router.post('/generate', generate);

module.exports = router;
