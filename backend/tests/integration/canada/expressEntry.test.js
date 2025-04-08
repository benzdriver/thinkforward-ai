const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../../../../app');
const ExpressEntryProfile = require('../../../../models/canada/ExpressEntryProfile');
const expressEntryService = require('../../../../services/canada/expressEntryService');
const { createTestUser, generateAuthToken } = require('../../helpers/testHelpers');

describe('Express Entry Integration Tests', function() {
  let authToken;
  let testUser;

  before(async function() {
    testUser = await createTestUser();
    authToken = generateAuthToken(testUser);
  });

  after(async function() {
    await mongoose.connection.dropCollection('expressEntryProfiles')
      .catch(err => {
        if (err.code !== 26) throw err;
      });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('POST /api/canada/express-entry/calculate-score', function() {
    it('should calculate CRS points for a valid profile', async function() {
      const profileData = {
        age: 30,
        maritalStatus: 'single',
        education: [
          {
            level: 'bachelors',
            institution: 'University of Toronto',
            country: 'Canada'
          }
        ],
        languageProficiency: [
          {
            language: 'english',
            test: 'IELTS',
            speaking: 7,
            listening: 8,
            reading: 7,
            writing: 7
          }
        ],
        workExperience: [
          {
            occupation: { title: 'Software Developer', noc: '21231' },
            employer: 'Tech Company',
            country: 'Canada',
            isCanadianExperience: true,
            startDate: '2020-01-01',
            endDate: '2022-01-01',
            hoursPerWeek: 40
          }
        ]
      };

      const pointsResult = {
        totalPoints: 450,
        breakdown: {
          age: 110,
          education: 120,
          language: 124,
          workExperience: 80,
          adaptability: 16
        }
      };
      
      sinon.stub(expressEntryService, 'calculatePoints').returns(pointsResult);

      const response = await request(app)
        .post('/api/canada/express-entry/calculate-score')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.totalPoints).to.equal(pointsResult.totalPoints);
      expect(response.body.breakdown).to.deep.equal(pointsResult.breakdown);
    });

    it('should return 400 for invalid profile data', async function() {
      const invalidData = {
      };

      const response = await request(app)
        .post('/api/canada/express-entry/calculate-score')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.exist;
    });
  });

  describe('GET /api/canada/express-entry/latest-draws', function() {
    it('should return latest Express Entry draws', async function() {
      const mockDraws = [
        {
          date: '2023-11-15',
          program: 'CEC',
          invitations: 1000,
          lowestScore: 481
        },
        {
          date: '2023-11-01',
          program: 'PNP',
          invitations: 800,
          lowestScore: 720
        }
      ];

      sinon.stub(expressEntryService, 'getLatestDraws').resolves(mockDraws);

      const response = await request(app)
        .get('/api/canada/express-entry/latest-draws')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.draws).to.deep.equal(mockDraws);
    });
  });

  describe('POST /api/canada/express-entry/profile', function() {
    it('should save a new Express Entry profile', async function() {
      const profileData = {
        age: 32,
        education: [{ level: 'masters' }],
        languageProficiency: [{ language: 'english', test: 'IELTS' }]
      };

      const savedProfile = {
        _id: 'profile123',
        userId: testUser._id,
        ...profileData
      };
      
      sinon.stub(ExpressEntryProfile, 'create').resolves(savedProfile);

      const response = await request(app)
        .post('/api/canada/express-entry/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(201);

      expect(response.body.success).to.be.true;
      expect(response.body.profile).to.deep.equal(savedProfile);
    });

    it('should return 401 when not authenticated', async function() {
      const response = await request(app)
        .post('/api/canada/express-entry/profile')
        .send({ age: 30 })
        .expect(401);

      expect(response.body.success).to.be.false;
    });
  });

  describe('GET /api/canada/express-entry/profile/:id', function() {
    it('should retrieve an Express Entry profile by ID', async function() {
      const profileId = 'profile123';

      const mockProfile = {
        _id: profileId,
        userId: testUser._id.toString(),
        age: 29,
        education: [{ level: 'bachelors' }]
      };

      sinon.stub(ExpressEntryProfile, 'findById').resolves(mockProfile);

      const response = await request(app)
        .get(`/api/canada/express-entry/profile/${profileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.profile).to.deep.equal(mockProfile);
    });

    it('should return 404 when profile is not found', async function() {
      const nonExistentId = 'nonexistent';

      sinon.stub(ExpressEntryProfile, 'findById').resolves(null);

      const response = await request(app)
        .get(`/api/canada/express-entry/profile/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.include('not found');
    });
  });

  describe('Frontend-Backend Integration', function() {
    it('should integrate with PointsCalculator component', async function() {
      
      const profileData = {
        age: 30,
        maritalStatus: 'single',
        education: [
          {
            level: 'bachelors',
            institution: 'University of Toronto',
            country: 'Canada'
          }
        ],
        languageProficiency: [
          {
            language: 'english',
            test: 'IELTS',
            speaking: 7,
            listening: 8,
            reading: 7,
            writing: 7
          }
        ],
        workExperience: [
          {
            occupation: { title: 'Software Developer', noc: '21231' },
            employer: 'Tech Company',
            country: 'Canada',
            isCanadianExperience: true,
            startDate: '2020-01-01',
            endDate: '2022-01-01',
            hoursPerWeek: 40
          }
        ]
      };

      const pointsResult = {
        totalPoints: 450,
        breakdown: {
          age: 110,
          education: 120,
          language: 124,
          workExperience: 80,
          adaptability: 16
        }
      };
      
      sinon.stub(expressEntryService, 'calculatePoints').returns(pointsResult);

      const response = await request(app)
        .post('/api/canada/express-entry/calculate-score')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.totalPoints).to.equal(pointsResult.totalPoints);
      expect(response.body.breakdown).to.deep.equal(pointsResult.breakdown);
      
    });

    it('should integrate with AIRecommendationEngine component', async function() {
      
      const mockRecommendations = [
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
      
      const aiServiceStub = sinon.stub();
      aiServiceStub.resolves(mockRecommendations);
      sinon.stub(require('../../../../services/canada/aiService'), 'getRecommendations').callsFake(aiServiceStub);
      
      const profileData = {
        profile: {
          age: 35,
          education: [{ level: 'bachelors' }],
          languageProficiency: [{ language: 'english', test: 'IELTS', speaking: 6, listening: 7, reading: 6, writing: 6 }]
        }
      };
      
      const response = await request(app)
        .post('/api/canada/ai/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);
        
      expect(response.body.success).to.be.true;
      expect(response.body.recommendations).to.deep.equal(mockRecommendations);
      
    });
  });
});
