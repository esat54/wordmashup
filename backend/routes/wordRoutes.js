const express = require('express');
const router = express.Router();

const { addWord } = require('../controllers/wordController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, addWord);


module.exports = router;