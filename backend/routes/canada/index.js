const express = require('express');
const router = express.Router();

const expressEntryController = require('../../controllers/canada/expressEntry');
const pnpController = require('../../controllers/canada/pnp');
const documentController = require('../../controllers/canada/document');
const aiController = require('../../controllers/canada/ai');
const consultantController = require('../../controllers/canada/consultant');

router.post('/express-entry/calculate-score', expressEntryController.calculatePoints);
router.get('/express-entry/latest-draws', expressEntryController.getLatestDraws);
router.post('/express-entry/profile', expressEntryController.saveProfile);
router.get('/express-entry/profile/:id', expressEntryController.getProfile);

router.post('/pnp/eligibility-check', pnpController.checkEligibility);
router.get('/pnp/programs/:province', pnpController.getProvincialPrograms);

router.post('/documents/checklist', documentController.getDocumentChecklist);
router.post('/documents/upload', documentController.uploadDocument);
router.get('/documents/:id', documentController.getDocument);

router.get('/ai/document-analysis/:documentId', aiController.analyzeDocument);
router.post('/ai/eligibility-assessment', aiController.assessEligibility);
router.post('/ai/recommendations', aiController.getRecommendations);
router.get('/ai/trend-predictions/:province', aiController.getTrendPredictions);

router.get('/consultant/cases', consultantController.getCases);

module.exports = router;
