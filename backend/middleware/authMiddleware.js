const jwt = require('jsonwebtoken'); 

exports.authenticate = async (req, res, next) => {
    try {
        // 1. Header'dan tokeni al
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token gereklidir' 
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId; 

        next(); // Controllera geç

    } catch (error) {
        console.error('Auth middleware error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
             return res.status(401).json({ error: 'Unauthorized', message: 'Oturum süresi doldu, tekrar giriş yapın.' });
        }

        res.status(401).json({
            error: 'Unauthorized',
            message: 'Geçersiz token (Kimlik doğrulanamadı)'
        });
    }
};