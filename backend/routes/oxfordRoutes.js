const express = require('express');
const router = express.Router();

const { getWordsByCategory, updateWordNote, updateWordStatus, getStats } = require('../controllers/oxfordController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/stats', authenticate, getStats);
router.get('/category/:categoryId', authenticate, getWordsByCategory);
router.patch('/:wordId/note', authenticate, updateWordNote);
router.patch('/:wordId/status', authenticate, updateWordStatus);

module.exports = router;