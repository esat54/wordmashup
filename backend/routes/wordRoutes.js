const express = require('express');
const router = express.Router();

const { addWord, getWords, addtoFavorites, deleteWord } = require('../controllers/wordController');
const { authenticate } = require('../middleware/authMiddleware');


router.post('/', authenticate, addWord);
router.get('/', authenticate, getWords);
router.post('/:wordId/favorite', authenticate, addtoFavorites);
router.delete('/:wordId', authenticate, deleteWord);

module.exports = router;