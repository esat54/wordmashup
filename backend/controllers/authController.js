const authModel = require('../models/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Validation error', message: 'Tüm alanlar gereklidir' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await authModel.createUser(name, email, hashedPassword);

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı'
        });
    } catch (error) {
        console.error('Register error:', error);

        if (error.message && error.message.includes('zaten kullanılıyor')) {
            return res.status(409).json({
                error: 'Duplicate email',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            message: error.message || 'Kayıt sırasında bir hata oluştu'
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'E-posta ve şifre gereklidir'
            });
        }

        const user = await authModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'E-posta veya şifre hatalı'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'E-posta veya şifre hatalı'
            });
        }


        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );


        const responseData = {
            success: true,
            message: 'Giriş başarılı',
            token: token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Giriş sırasında bir hata oluştu'
        });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Mevcut şifre ve yeni şifre gereklidir'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Yeni şifre en az 6 karakter olmalıdır'
            });
        }

        const user = await authModel.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Kullanıcı bulunamadı'
            });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Mevcut şifre hatalı'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Şifre başarıyla değiştirildi'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Şifre değiştirilirken bir hata oluştu'
        });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await authModel.findUserById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                streakCount: user.streakCount || 0,
                lastActivityDate: user.lastActivityDate
            }
        });
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Kullanıcı bilgileri getirilirken bir hata oluştu'
        });
    }
};

exports.deleteAccount = async (req, res) => {
    const { password } = req.body;
    const userId = req.userId;

    try {
        if (!password) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Şifre gereklidir'
            });
        }

        const user = await authModel.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Kullanıcı bulunamadı'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Şifre hatalı'
            });
        }

        const Word = require('../models/wordModel');

        await Word.deleteMany({ addedBy: userId });
        await authModel.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: 'Hesap başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Hesap silinirken bir hata oluştu'
        });
    }
};