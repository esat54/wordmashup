const express = require('express');
const router = express.Router();

const { getAllGrammars, getGrammarById, togglePin, getCategories, createGrammar, updateGrammar, deleteGrammar, deleteCategory } = require('../controllers/grammarController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getAllGrammars);
router.get('/categories', authenticate, getCategories);
router.delete('/categories', authenticate, deleteCategory);
router.post('/', authenticate, createGrammar);
router.get('/:id', authenticate, getGrammarById);
router.put('/:id', authenticate, updateGrammar);
router.delete('/:id', authenticate, deleteGrammar);
router.post('/:id/toggle-pin', authenticate, togglePin);

module.exports = router;