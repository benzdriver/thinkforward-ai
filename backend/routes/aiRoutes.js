const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// 旧版API兼容 - POST /api/ai/chat (支持当前前端)
router.post('/chat', auth, aiController.handleLegacyChat);

// 创建新对话 - POST /api/ai/new-chat
router.post('/new-chat', auth, aiController.createChat);

// 发送消息 - POST /api/ai/message
router.post('/message', auth, aiController.sendMessage);

// 获取对话历史 - GET /api/ai/chat/history
router.get('/chat/history', auth, aiController.getChatHistory);

// 获取单个对话 - GET /api/ai/chat/:chatId
router.get('/chat/:chatId', auth, aiController.getChatById);

// 执行初始评估 - POST /api/ai/assessment
router.post('/assessment', auth, aiController.performInitialAssessment);

// 获取表单帮助 - POST /api/ai/form-help
router.post('/form-help', auth, aiController.getFormHelp);

// 文档审核 - POST /api/ai/document-review
router.post('/document-review', auth, aiController.reviewDocument);

// 聊天相关端点
router.post('/chat', auth, aiController.sendMessage);
router.get('/chats', auth, aiController.getUserChats);
router.get('/chat/:chatId', auth, aiController.getChatById);
router.delete('/chat/:chatId', auth, aiController.deleteChat);

// 评估相关端点
router.post('/assessment', auth, aiController.createAssessment);
router.get('/assessments', auth, aiController.getUserAssessments);
router.get('/assessment/:assessmentId', auth, aiController.getAssessmentById);

// 表单帮助
router.post('/form-help', auth, aiController.getFormFieldHelp);

// 上传文件以获取AI分析
router.post('/analyze-file', auth, aiController.analyzeFile);

module.exports = router; 