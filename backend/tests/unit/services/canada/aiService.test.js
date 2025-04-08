const { expect } = require('chai');
const sinon = require('sinon');
const aiService = require('../../../../services/canada/aiService');
const DocumentSubmission = require('../../../../models/canada/DocumentSubmission');

describe('AI Service Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('analyzeDocument', function() {
    it('should analyze a document and return results', async function() {
      const documentId = 'doc123';
      const userId = 'user123';

      const mockDocument = {
        _id: documentId,
        userId,
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileUrl: 'https://example.com/files/passport.pdf'
      };

      sinon.stub(DocumentSubmission, 'findById').resolves(mockDocument);

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

      sinon.stub(aiService, 'performDocumentAnalysis').resolves(analysisResult);

      const result = await aiService.analyzeDocument(documentId, userId);

      expect(result).to.deep.equal(analysisResult);
      expect(DocumentSubmission.findById.calledWith(documentId)).to.be.true;
      expect(aiService.performDocumentAnalysis.calledWith(mockDocument)).to.be.true;
    });

    it('should throw error when document is not found', async function() {
      const documentId = 'nonexistent';
      const userId = 'user123';

      sinon.stub(DocumentSubmission, 'findById').resolves(null);

      try {
        await aiService.analyzeDocument(documentId, userId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.include('not found');
      }
    });

    it('should throw error for unauthorized access', async function() {
      const documentId = 'doc123';
      const userId = 'user123';
      const differentUserId = 'differentUser';

      const mockDocument = {
        _id: documentId,
        userId: differentUserId,
        documentType: 'Passport',
        fileName: 'passport.pdf'
      };

      sinon.stub(DocumentSubmission, 'findById').resolves(mockDocument);

      try {
        await aiService.analyzeDocument(documentId, userId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.include('Unauthorized');
      }
    });
  });

  describe('assessEligibility', function() {
    it('should assess eligibility using AI and return results', async function() {
      const profile = {
        age: 32,
        education: [{ level: 'masters' }],
        languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 7, listening: 8, reading: 7, writing: 7 }],
        workExperience: [{ occupation: { title: 'Software Developer' }, isCanadianExperience: true }]
      };
      const programId = 'program123';

      const mockProgram = {
        _id: programId,
        name: 'Ontario Immigrant Nominee Program - Tech Draw',
        eligibilityCriteria: ['Tech work experience', 'CLB 7+']
      };

      sinon.stub(aiService, 'getProgram').resolves(mockProgram);

      const assessmentResult = {
        profileId: 'profile123',
        programId,
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

      sinon.stub(aiService, 'performEligibilityAssessment').resolves(assessmentResult);

      const result = await aiService.assessEligibility(profile, programId);

      expect(result).to.deep.equal(assessmentResult);
      expect(aiService.getProgram.calledWith(programId)).to.be.true;
      expect(aiService.performEligibilityAssessment.calledWith(profile, mockProgram)).to.be.true;
    });

    it('should throw error when program is not found', async function() {
      const profile = { age: 32 };
      const programId = 'nonexistent';

      sinon.stub(aiService, 'getProgram').resolves(null);

      try {
        await aiService.assessEligibility(profile, programId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.include('not found');
      }
    });
  });

  describe('getRecommendations', function() {
    it('should generate AI recommendations based on profile', async function() {
      const profile = {
        age: 35,
        education: [{ level: 'bachelors' }],
        languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 6, listening: 7, reading: 6, writing: 6 }],
        workExperience: [{ occupation: { title: 'Marketing Manager' }, isCanadianExperience: false }]
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

      sinon.stub(aiService, 'generateRecommendations').resolves(recommendations);

      const result = await aiService.getRecommendations(profile);

      expect(result).to.deep.equal(recommendations);
      expect(aiService.generateRecommendations.calledWith(profile)).to.be.true;
    });

    it('should handle invalid profile data', async function() {
      const invalidProfile = {
      };

      const validationError = new Error('Invalid profile data');
      sinon.stub(aiService, 'generateRecommendations').rejects(validationError);

      try {
        await aiService.getRecommendations(invalidProfile);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(validationError);
      }
    });
  });

  describe('getTrendPredictions', function() {
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

      sinon.stub(aiService, 'generateTrendPredictions').resolves(predictions);

      const result = await aiService.getTrendPredictions(province);

      expect(result).to.deep.equal(predictions);
      expect(aiService.generateTrendPredictions.calledWith(province)).to.be.true;
    });

    it('should validate province parameter', async function() {
      const invalidProvince = 'invalid';

      sinon.stub(aiService, 'validateProvince').throws(new Error('Invalid province'));

      try {
        await aiService.getTrendPredictions(invalidProvince);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.include('Invalid province');
      }
    });
  });
});
