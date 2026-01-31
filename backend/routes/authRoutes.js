const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getUserInfo);
router.post('/change-password', authenticate, authController.changePassword);
router.delete('/account', authenticate, authController.deleteAccount);
router.post('/tester-login', authController.testerLogin);

module.exports = router;