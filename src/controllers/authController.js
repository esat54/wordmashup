const authModel = require('../models/authModel');
const bcrypt = require("bcrypt");


exports.getHomepage = (req, res) => {
  res.render('homepage');
};

exports.getLogin = (req, res) => {
  res.render('auth');
};

exports.getRegister = (req, res) => {
  res.render('auth');
};

exports.getWords = (req, res) => {
  res.render('wordpage');
};



exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log( "Giriş denemesi", req.body); 

    if (!username || !password) {
      return res.status(400).json({ message: "Lütfen tüm alanları doldurun" });
    }

    const user = await authModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
    }

    const isMatch = await bcrypt.compare(password, user.userpassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
    }

    req.session.userId = user.userId; 
    console.log("Kullanıcı giriş yaptı:", user.username, user.userId);

    res.redirect('/');

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


exports.postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Kayıt denemesi", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Lütfen tüm alanları doldurun" });
    }

    const existingUser = await authModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Kullanıcı adı zaten mevcut" });
    }

    const existingEmail = await authModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "Bu e-posta zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authModel.createUser({ username, email, hashedPassword });

    req.session.userId = newUser.userId;

    console.log("Kullanıcı kaydedildi:", newUser .username, newUser.userId);

    res.redirect('/');
    
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
