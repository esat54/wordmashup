const authModel = require('../models/authModel');
const bcrypt = require("bcrypt");


exports.getHomepage = (req, res) => {
  res.render('homepage');
};

exports.getLogin = (req, res) => {
  const message = req.session.message;
  delete req.session.message; // sadece 1 kere görünür
  res.render('auth', { message });
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
    console.log("Giriş denemesi", req.body);

    if (!username || !password) {
      req.session.message = "Lütfen tüm alanları doldurun";
      return res.redirect('/login');
    }

    const user = await authModel.findUserByUsername(username);
    if (!user) {
      req.session.message = "Geçersiz kullanıcı adı veya şifre.";
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.userpassword);
    if (!isMatch) {
      req.session.message = "Geçersiz kullanıcı adı veya şifre.";
      return res.redirect('/login');
    }

    req.session.userId = user.userId;
    req.session.username = user.username;
    req.session.createdDate = user.usercreateddate;

    console.log("Kullanıcı giriş yaptı:", user.username, user.userId);

    res.redirect('/');

  } catch (err) {
    req.session.message = "Sunucu hatası";
    console.log(err)
    return res.render('/login');
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

    console.log("Kullanıcı kaydedildi:", newUser.username, newUser.userId);

    req.session.message = "Kayıt başarılı! Şimdi giriş yapabilirsiniz.";
    res.redirect('/login');


  } catch (err) {
    req.session.message = "Sunucu hatası";
    console.log(err)
    return res.render('/login');
  }
};
