const authModel = require('../models/authModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Tüm alanlar gereklidir'
            });
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

        res.status(200).json({
            success: true,
            message: 'Giriş başarılı',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Giriş sırasında bir hata oluştu'
        });
    }
};