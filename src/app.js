const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const wordRoutes = require('./routes/wordRoutes');
const dictionaryRoutes = require('./routes/dictionaryRoutes');
const cardquizRoutes = require('./routes/cardquizRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use(session({
    secret: 'hidden-key',
    resave: false,
    saveUninitialized: false
}));

// session'dan user bilgisini tüm view'lara aktar
app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.user = {
            id: req.session.userId,
            username: req.session.username,
            createdDate: req.session.createdDate
        };
    } else {
        res.locals.user = null;
    }
    next();
});


app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/', authRoutes);
app.use('/words', wordRoutes);
app.use('/dictionary', dictionaryRoutes);
app.use('/cardquiz', cardquizRoutes);


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).send("Çıkış yapılamadı.");
        }
        res.redirect('/');         
    });
});




app.listen(3000, () => console.log('Server running on http://localhost:3000'));