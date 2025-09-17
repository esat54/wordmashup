const express = require('express');
const router = express.Router();

const dictionaryController = require('../controllers/dictionaryController');

router.get('/', dictionaryController.getDictionary);
router.post('/', dictionaryController.postDictionary);



module.exports = router;