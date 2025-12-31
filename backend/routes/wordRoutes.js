const express = require('express');
const router = express.Router();

const { addWord, getWords, addtoFavorites, addtoUnknown, deleteWord } = require('../controllers/wordController');
const { authenticate } = require('../middleware/authMiddleware');


router.post('/', authenticate, addWord);
router.get('/', authenticate, getWords);
router.post('/:wordId/favorite', authenticate, addtoFavorites);
router.post('/:wordId/unknown', authenticate, addtoUnknown);
router.delete('/:wordId', authenticate, deleteWord);

module.exports = router;