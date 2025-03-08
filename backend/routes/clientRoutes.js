const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

// 创建客户资料
router.post('/', auth, clientController.createClient);

// 获取客户资料
router.get('/:clientId', auth, clientController.getClientById);
router.get('/user/:userId', auth, clientController.getClientByUserId);

// 更新客户资料
router.put('/:clientId', auth, clientController.updateClient);

// 添加教育经历
router.post('/:clientId/education', auth, clientController.addEducation);
router.put('/:clientId/education/:eduId', auth, clientController.updateEducation);
router.delete('/:clientId/education/:eduId', auth, clientController.deleteEducation);

// 添加工作经验
router.post('/:clientId/work-experience', auth, clientController.addWorkExperience);
router.put('/:clientId/work-experience/:expId', auth, clientController.updateWorkExperience);
router.delete('/:clientId/work-experience/:expId', auth, clientController.deleteWorkExperience);

// 添加语言测试
router.post('/:clientId/language-test', auth, clientController.addLanguageTest);
router.put('/:clientId/language-test/:testId', auth, clientController.updateLanguageTest);
router.delete('/:clientId/language-test/:testId', auth, clientController.deleteLanguageTest);

// 添加文档
router.post('/:clientId/document', auth, clientController.addDocument);
router.put('/:clientId/document/:docId', auth, clientController.updateDocument);
router.delete('/:clientId/document/:docId', auth, clientController.deleteDocument);

// 添加笔记
router.post('/:clientId/note', auth, clientController.addNote);
router.delete('/:clientId/note/:noteId', auth, clientController.deleteNote);

module.exports = router; 