const express = require('express');
const { getUserQuizWords, getGlobalWords, saveQuizWord } = require("../controllers/quizController.js");
const { authenticate } = require("../middleware/authMiddleware.js");


const router = express.Router();

router.get("/user", authenticate, getUserQuizWords);
router.get("/global", getGlobalWords);
router.post("/save", authenticate, saveQuizWord);

module.exports = router;
