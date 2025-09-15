const express = require('express');
const router = express.Router();

const wordController = require('../controllers/wordController');


router.get('/', wordController.getWords); 
router.post('/', wordController.postWords);

router.post('/deleteWord/:id', wordController.deleteWords);

module.exports = router;