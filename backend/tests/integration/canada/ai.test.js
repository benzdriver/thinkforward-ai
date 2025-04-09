const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../../../app');
const DocumentSubmission = require('../../../models/canada/DocumentSubmission');
const aiService = require('../../../services/canada/aiService');
const { 
  createTestUser, 
  generateAuthToken, 
  connectToTestDatabase,
  disconnectFromTestDatabase,
  mockAuthMiddleware
} = require('../../helpers/testHelpers');

describe('Canada Integration Tests - AI Features', function() {
  let authToken;
  let testUser;

  before(async function() {
    try {
      await connectToTestDatabase();
      
      testUser = await createTestUser();
      authToken = generateAuthToken(testUser);
      
      const AuthService = require('../../../services/authService');
      const authServiceProto = AuthService.prototype;
      sinon.stub(authServiceProto, 'verifyToken').resolves({ 
        id: testUser._id.toString() 
      });
      
    } catch (error) {
      console.error('Error in before hook:', error);
      testUser = {
        _id: new mongoose.Types.ObjectId(),
        id: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      };
      authToken = generateAuthToken(testUser);
      
      const AuthService = require('../../../services/authService');
      const authServiceProto = AuthService.prototype;
      sinon.stub(authServiceProto, 'verifyToken').resolves({ 
        id: testUser._id.toString() 
      });
    }
  });

  after(async function() {
    this.timeout(30000);
    
    try {
      await mongoose.connection.dropCollection('documentsubmissions');
    } catch (err) {
      if (err.code !== 26) console.error('Error dropping collection:', err);
    }
    
    try {
      await disconnectFromTestDatabase();
      console.log('Successfully disconnected from test database');
    } catch (err) {
      console.error('Error disconnecting from test database:', err);
    }
  });

  beforeEach(function() {
    const User = require('../../../models/User');
    sinon.stub(User, 'findById').callsFake((id) => {
      console.log('Stubbed User.findById called with:', id);
      return Promise.resolve(testUser);
    });
  });
  
  afterEach(function() {
    sinon.restore();
  });

  describe('GET /api/canada/ai/document-analysis/:documentId', function() {
    it('should analyze a document and return results', async function() {
      const documentId = 'doc123';

      const mockDocument = {
        _id: documentId,
        userId: testUser._id.toString(),
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileUrl: 'https://example.com/files/passport.pdf'
      };

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

      sinon.stub(DocumentSubmission, 'findById').resolves(mockDocument);
      sinon.stub(aiService, 'analyzeDocument').resolves(analysisResult);

      const response = await request(app)
        .get(`/api/canada/ai/document-analysis/${documentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.analysis).to.deep.equal(analysisResult);
    });

    it('should return 404 when document is not found', async function() {
      const nonExistentId = 'nonexistent';

      sinon.stub(DocumentSubmission, 'findById').resolves(null);

      const response = await request(app)
        .get(`/api/canada/ai/document-analysis/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.include('not found');
    });
  });

  describe('POST /api/canada/ai/eligibility-assessment', function() {
    it('should assess eligibility using AI and return results', async function() {
      const requestData = {
        profile: {
          age: 32,
          education: [{ level: 'masters' }],
          languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 7, listening: 8, reading: 7, writing: 7 }],
          workExperience: [{ occupation: { title: 'Software Developer' }, isCanadianExperience: true }]
        },
        programId: 'program123'
      };

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

      const response = await request(app)
        .post('/api/canada/ai/eligibility-assessment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.assessment).to.deep.equal(assessmentResult);
    });

    it('should return 400 for invalid request data', async function() {
      const invalidData = {
      };

      const response = await request(app)
        .post('/api/canada/ai/eligibility-assessment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.exist;
    });
  });

  describe('POST /api/canada/ai/recommendations', function() {
    it('should generate AI recommendations based on profile', async function() {
      const requestData = {
        profile: {
          age: 35,
          education: [{ level: 'bachelors' }],
          languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 6, listening: 7, reading: 6, writing: 6 }],
          workExperience: [{ occupation: { title: 'Marketing Manager' }, isCanadianExperience: false }]
        }
      };

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

      const response = await request(app)
        .post('/api/canada/ai/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.recommendations).to.deep.equal(recommendations);
    });

    it('should return 400 for invalid request data', async function() {
      const invalidData = {
      };

      const response = await request(app)
        .post('/api/canada/ai/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.exist;
    });
  });

  describe('GET /api/canada/ai/trend-predictions/:province', function() {
    it('should return trend predictions for a province', async function() {
      const province = 'ontario';

      const predictions = {
        province,
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

      const response = await request(app)
        .get(`/api/canada/ai/trend-predictions/${province}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.predictions).to.deep.equal(predictions);
    });
  });

  describe('Serverless API Integration', function() {
    it('should integrate with serverless AI recommendation endpoint', async function() {
      const requestData = {
        profile: {
          age: 35,
          education: [{ level: 'bachelors' }],
          languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 6, listening: 7, reading: 6, writing: 6 }],
          workExperience: [{ occupation: { title: 'Marketing Manager' }, isCanadianExperience: false }]
        }
      };

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
        }
      ];

      sinon.stub(aiService, 'getRecommendations').resolves(recommendations);

      try {
        const response = await request(app)
          .post('/api/serverless/canada/recommendations')
          .set('Authorization', `Bearer ${authToken}`)
          .send(requestData);
        
        console.log('Serverless response status:', response.status);
        console.log('Serverless response body:', JSON.stringify(response.body, null, 2));
        
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.recommendations).to.deep.equal(recommendations);
      } catch (error) {
        console.error('Serverless test error:', error.message);
        if (error.response) {
          console.error('Response body:', JSON.stringify(error.response.body, null, 2));
        }
        throw error;
      }
    });
  });

  describe('Frontend-Backend Integration', function() {
    it('should integrate with AI document analysis component', async function() {
      
      const documentId = 'doc123';

      const mockDocument = {
        _id: documentId,
        userId: testUser._id.toString(),
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileUrl: 'https://example.com/files/passport.pdf'
      };

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

      sinon.stub(DocumentSubmission, 'findById').resolves(mockDocument);
      sinon.stub(aiService, 'analyzeDocument').resolves(analysisResult);

      const response = await request(app)
        .get(`/api/canada/ai/document-analysis/${documentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.analysis).to.deep.equal(analysisResult);
      
    });

    it('should integrate with AI eligibility assessment component', async function() {
      
      const requestData = {
        profile: {
          age: 32,
          education: [{ level: 'masters' }],
          languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 7, listening: 8, reading: 7, writing: 7 }],
          workExperience: [{ occupation: { title: 'Software Developer' }, isCanadianExperience: true }]
        },
        programId: 'program123'
      };

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

      const response = await request(app)
        .post('/api/canada/ai/eligibility-assessment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.assessment).to.deep.equal(assessmentResult);
      
    });

    it('should integrate with AI recommendation engine component', async function() {
      
      const requestData = {
        profile: {
          age: 35,
          education: [{ level: 'bachelors' }],
          languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 6, listening: 7, reading: 6, writing: 6 }],
          workExperience: [{ occupation: { title: 'Marketing Manager' }, isCanadianExperience: false }]
        }
      };

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
        }
      ];

      sinon.stub(aiService, 'getRecommendations').resolves(recommendations);

      const response = await request(app)
        .post('/api/canada/ai/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.recommendations).to.deep.equal(recommendations);
      
    });
  });
});
