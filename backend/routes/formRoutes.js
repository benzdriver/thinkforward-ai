const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const auth = require('../middleware/auth');

// 创建表单模板
router.post('/template', auth, formController.createFormTemplate);

// 获取表单模板
router.get('/templates', auth, formController.getFormTemplates);
router.get('/template/:templateId', auth, formController.getFormTemplateById);

// 基于模板创建表单实例
router.post('/instance/:templateId', auth, formController.createFormInstance);

// 获取表单实例
router.get('/instance/:instanceId', auth, formController.getFormInstanceById);
router.get('/instances/user', auth, formController.getUserFormInstances);

// 更新表单实例
router.put('/instance/:instanceId', auth, formController.updateFormInstance);
router.post('/instance/:instanceId/submit', auth, formController.submitFormInstance);

// 表单搜索和过滤
router.get('/search', auth, formController.searchForms);

// 删除表单
router.delete('/template/:templateId', auth, formController.deleteFormTemplate);
router.delete('/instance/:instanceId', auth, formController.deleteFormInstance);

module.exports = router; 