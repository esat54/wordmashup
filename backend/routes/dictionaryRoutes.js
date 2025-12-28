const express = require("express");
const router = express.Router();
const dictionaryController = require("../controllers/dictionaryController");

const { authenticate } = require('../middleware/authMiddleware');

router.post("/analyze", authenticate, dictionaryController.analyzeWord);

module.exports = router;