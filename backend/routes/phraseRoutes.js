const express = require('express');
const router = express.Router();

const phraseController = require('../controllers/phraseController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, phraseController.getAllPhrases);
router.post('/', authenticate, phraseController.createPhrase);
router.put('/:id', authenticate, phraseController.updatePhrase);
router.delete('/:id', authenticate, phraseController.deletePhrase);

module.exports = router;
