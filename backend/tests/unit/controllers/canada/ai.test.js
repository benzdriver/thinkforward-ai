const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('../../../helpers/mock-request');
const aiController = require('../../../../controllers/canada/ai');
const aiService = require('../../../../services/canada/aiService');

describe('AI Controller Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('analyzeDocument', function() {
    it('should analyze a document and return results', async function() {
      const documentId = 'doc123';
      const req = httpMocks.createRequest({
        params: { documentId },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const analysisResult = {
        documentId,
        documentType: 'Passport',
        isComplete: true,
        confidence: 0.92,
        reasoning: 'Document contains all required information',
        extractedData: {
          name: 'John Smith',
          passportNumber: 'AB123456',
          expiryDate: '2028-05-15'
        }
      };

      sinon.stub(aiService, 'analyzeDocument').resolves(analysisResult);

      await aiController.analyzeDocument(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.analysis).to.deep.equal(analysisResult);
      expect(aiService.analyzeDocument.calledWith(documentId, 'user123')).to.be.true;
    });

    it('should handle document not found errors', async function() {
      const req = httpMocks.createRequest({
        params: { documentId: 'nonexistent' },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const notFoundError = new Error('Document not found');
      sinon.stub(aiService, 'analyzeDocument').rejects(notFoundError);

      await aiController.analyzeDocument(req, res);

      expect(res.statusCode).to.equal(404);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('not found');
    });

    it('should handle unauthorized access to documents', async function() {
      const req = httpMocks.createRequest({
        params: { documentId: 'doc123' },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const unauthorizedError = new Error('Unauthorized to access this document');
      sinon.stub(aiService, 'analyzeDocument').rejects(unauthorizedError);

      await aiController.analyzeDocument(req, res);

      expect(res.statusCode).to.equal(403);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('Unauthorized');
    });
  });

  describe('assessEligibility', function() {
    it('should assess eligibility using AI and return results', async function() {
      const req = httpMocks.createRequest({
        body: {
          profile: {
            age: 32,
            education: [{ level: 'masters' }],
            languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 7, listening: 8, reading: 7, writing: 7 }],
            workExperience: [{ occupation: { title: 'Software Developer' }, isCanadianExperience: true }]
          },
          programId: 'program123'
        },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const assessmentResult = {
        profileId: 'profile123',
        programId: 'program123',
        isEligible: true,
        confidence: 0.85,
        reasoning: 'Profile meets all core requirements',
        factorScores: [
          { factor: 'Age', score: 25, maxScore: 30, impact: 'Medium' },
          { factor: 'Education', score: 25, maxScore: 25, impact: 'High' },
          { factor: 'Language', score: 24, maxScore: 28, impact: 'High' },
          { factor: 'Work Experience', score: 15, maxScore: 15, impact: 'Medium' }
        ],
        overallScore: 89,
        thresholdScore: 67,
        suggestedActions: ['Improve French language skills for additional points']
      };

      sinon.stub(aiService, 'assessEligibility').resolves(assessmentResult);

      await aiController.assessEligibility(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.assessment).to.deep.equal(assessmentResult);
    });

    it('should handle missing profile data', async function() {
      const req = httpMocks.createRequest({
        body: {
          programId: 'program123'
        },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      await aiController.assessEligibility(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('profile');
    });

    it('should handle missing program ID', async function() {
      const req = httpMocks.createRequest({
        body: {
          profile: { age: 32 }
        },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      await aiController.assessEligibility(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('programId');
    });
  });

  describe('getRecommendations', function() {
    it('should generate AI recommendations based on profile', async function() {
      const req = httpMocks.createRequest({
        body: {
          profile: {
            age: 35,
            education: [{ level: 'bachelors' }],
            languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 6, listening: 7, reading: 6, writing: 6 }],
            workExperience: [{ occupation: { title: 'Marketing Manager' }, isCanadianExperience: false }]
          }
        },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const recommendations = [
        {
          id: 'rec1',
          title: 'Improve English language scores',
          description: 'Retake IELTS to achieve CLB 9 in all abilities',
          impact: 'High',
          effort: 'Medium',
          timeframe: 'Short-term',
          relevantFactors: ['Language proficiency', 'Express Entry points'],
          potentialBenefit: '+50 CRS points',
          confidence: 0.95
        },
        {
          id: 'rec2',
          title: 'Apply for Canadian work permit',
          description: 'Gain Canadian work experience to qualify for CEC',
          impact: 'High',
          effort: 'High',
          timeframe: 'Long-term',
          relevantFactors: ['Canadian experience', 'Express Entry eligibility'],
          potentialBenefit: 'CEC eligibility + 80 CRS points',
          confidence: 0.85
        }
      ];

      sinon.stub(aiService, 'getRecommendations').resolves(recommendations);

      await aiController.getRecommendations(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.recommendations).to.deep.equal(recommendations);
    });

    it('should handle missing profile data', async function() {
      const req = httpMocks.createRequest({
        body: {},
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      await aiController.getRecommendations(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('profile');
    });

    it('should handle service errors', async function() {
      const req = httpMocks.createRequest({
        body: {
          profile: { age: 35 }
        },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      sinon.stub(aiService, 'getRecommendations').rejects(new Error('AI service unavailable'));

      await aiController.getRecommendations(req, res);

      expect(res.statusCode).to.equal(500);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });

  describe('getTrendPredictions', function() {
    it('should return trend predictions for a province', async function() {
      const province = 'ontario';
      const req = httpMocks.createRequest({
        params: { province }
      });
      const res = httpMocks.createResponse();

      const predictions = {
        province: 'ontario',
        predictedPeriods: [
          {
            period: '2023-Q4',
            predictedInvitations: 1200,
            predictedMinimumScore: 470,
            confidenceInterval: { lower: 1100, upper: 1300 }
          },
          {
            period: '2024-Q1',
            predictedInvitations: 1350,
            predictedMinimumScore: 460,
            confidenceInterval: { lower: 1200, upper: 1500 }
          }
        ],
        growingOccupations: [
          { noc: '21234', title: 'Software Engineers', growthRate: 0.15, confidence: 0.88 },
          { noc: '30010', title: 'Registered Nurses', growthRate: 0.12, confidence: 0.85 }
        ],
        analysis: 'Ontario is expected to increase invitations over the next two quarters',
        confidenceScore: 0.82,
        dataPoints: 24
      };

      sinon.stub(aiService, 'getTrendPredictions').resolves(predictions);

      await aiController.getTrendPredictions(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.predictions).to.deep.equal(predictions);
      expect(aiService.getTrendPredictions.calledWith(province)).to.be.true;
    });

    it('should handle invalid province parameter', async function() {
      const req = httpMocks.createRequest({
        params: { province: 'invalid' }
      });
      const res = httpMocks.createResponse();

      sinon.stub(aiService, 'getTrendPredictions').rejects(new Error('Invalid province'));

      await aiController.getTrendPredictions(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('province');
    });

    it('should handle service unavailability', async function() {
      const req = httpMocks.createRequest({
        params: { province: 'ontario' }
      });
      const res = httpMocks.createResponse();

      sinon.stub(aiService, 'getTrendPredictions').rejects(new Error('AI service unavailable'));

      await aiController.getTrendPredictions(req, res);

      expect(res.statusCode).to.equal(500);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });
});
