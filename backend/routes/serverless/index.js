const express = require('express');
const router = express.Router();

const canadaRecommendations = require('../../api/serverless/canada/recommendations');

router.post('/canada/recommendations', canadaRecommendations);

module.exports = router;
