const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { auth } = require('../middleware/auth');

// 评估相关端点
router.post('/', auth, assessmentController.createAssessment);
router.get('/', auth, assessmentController.getAssessments);
router.get('/:id', auth, assessmentController.getAssessment);
router.put('/:id', auth, assessmentController.updateAssessment);
router.delete('/:id', auth, assessmentController.deleteAssessment);
router.get('/:id/pdf', auth, assessmentController.generatePDF);
router.post('/:id/regenerate', auth, assessmentController.regenerateAssessment);

module.exports = router; 