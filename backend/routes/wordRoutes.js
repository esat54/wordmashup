const express = require('express');
const router = express.Router();

const { addWord, getWords, addtoFavorites, addtoUnknown, deleteWord, updateNote, getLast7DaysStats, getTypeStats, getStreak } = require('../controllers/wordController');
const { authenticate } = require('../middleware/authMiddleware');


router.post('/', authenticate, addWord);
router.get('/', authenticate, getWords);
router.get('/stats/last7days', authenticate, getLast7DaysStats);
router.get('/stats/types', authenticate, getTypeStats);
router.get('/stats/streak', authenticate, getStreak);
router.post('/:wordId/favorite', authenticate, addtoFavorites);
router.post('/:wordId/unknown', authenticate, addtoUnknown);
router.patch('/:wordId/note', authenticate, updateNote);
router.delete('/:wordId', authenticate, deleteWord);

module.exports = router;