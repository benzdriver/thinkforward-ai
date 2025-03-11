const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Clerk WebHook (用于同步用户)
router.post('/webhook', authController.handleClerkWebhook);

// 用户认证状态
router.get('/status', auth, authController.getAuthStatus);

// 令牌验证
router.post('/verify-token', authController.verifyToken);

// 注销 (在需要时执行服务器端操作)
router.post('/logout', auth, authController.logout);

module.exports = router; 