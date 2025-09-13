const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('homepage');
});

router.get('/words', (req, res) => {
    res.render('wordpage');
});

module.exports = router;

