const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// 创建申请
router.post('/', auth, applicationController.createApplication);

// 获取申请
router.get('/:applicationId', auth, applicationController.getApplicationById);
router.get('/user/:userId', auth, applicationController.getUserApplications);
router.get('/client/:clientId', auth, applicationController.getClientApplications);

// 更新申请
router.put('/:applicationId', auth, applicationController.updateApplication);
router.put('/:applicationId/status', auth, applicationController.updateApplicationStatus);

// 时间线事件
router.post('/:applicationId/timeline', auth, applicationController.addTimelineEvent);
router.put('/:applicationId/timeline/:eventId', auth, applicationController.updateTimelineEvent);
router.delete('/:applicationId/timeline/:eventId', auth, applicationController.deleteTimelineEvent);

// 文档
router.post('/:applicationId/document', auth, applicationController.addApplicationDocument);
router.put('/:applicationId/document/:documentId', auth, applicationController.updateApplicationDocument);
router.delete('/:applicationId/document/:documentId', auth, applicationController.deleteApplicationDocument);

// 笔记
router.post('/:applicationId/note', auth, applicationController.addApplicationNote);
router.delete('/:applicationId/note/:noteId', auth, applicationController.deleteApplicationNote);

// 提醒
router.post('/:applicationId/reminder', auth, applicationController.createReminder);
router.put('/:applicationId/reminder/:reminderId', auth, applicationController.updateReminder);
router.delete('/:applicationId/reminder/:reminderId', auth, applicationController.deleteReminder);

module.exports = router; 