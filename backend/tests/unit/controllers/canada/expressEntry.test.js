const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('../../../helpers/mock-request');
const expressEntryController = require('../../../../controllers/canada/expressEntry');
const expressEntryService = require('../../../../services/canada/expressEntryService');
const ExpressEntryProfile = require('../../../../models/canada/ExpressEntryProfile');

describe('Express Entry Controller Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('calculatePoints', function() {
    it('should calculate points correctly with valid profile data', async function() {
      const req = httpMocks.createRequest({
        body: {
          age: 30,
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
              startDate: new Date('2020-01-01'),
              endDate: new Date('2022-01-01'),
              hoursPerWeek: 40
            }
          ],
          maritalStatus: 'single'
        }
      });
      const res = httpMocks.createResponse();

      const calculatePointsStub = sinon.stub().resolves({
        totalPoints: 450,
        breakdown: {
          age: 110,
          education: 120,
          language: 124,
          workExperience: 80,
          adaptability: 16
        }
      });
      
      sinon.stub(expressEntryService, 'calculatePoints').callsFake(calculatePointsStub);

      await expressEntryController.calculatePoints(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.totalPoints).to.equal(450);
      expect(data.breakdown).to.exist;
      expect(expressEntryService.calculatePoints.calledOnce).to.be.true;
    });

    it('should handle errors during points calculation', async function() {
      const req = httpMocks.createRequest({
        body: { /* incomplete data */ }
      });
      const res = httpMocks.createResponse();

      sinon.stub(expressEntryService, 'calculatePoints').rejects(new Error('Invalid profile data'));

      await expressEntryController.calculatePoints(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });

  describe('getLatestDraws', function() {
    it('should return latest Express Entry draws', async function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

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

      await expressEntryController.getLatestDraws(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.draws).to.deep.equal(mockDraws);
      expect(expressEntryService.getLatestDraws.calledOnce).to.be.true;
    });

    it('should handle errors when fetching draws', async function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      sinon.stub(expressEntryService, 'getLatestDraws').rejects(new Error('Failed to fetch draws'));

      await expressEntryController.getLatestDraws(req, res);

      expect(res.statusCode).to.equal(500);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });

  describe('saveProfile', function() {
    it('should save a new Express Entry profile', async function() {
      const profileData = {
        age: 32,
        education: [{ level: 'masters' }],
        languageProficiency: [{ language: 'english', test: 'IELTS' }]
      };
      
      const req = httpMocks.createRequest({
        body: profileData,
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const savedProfile = {
        _id: 'profile123',
        userId: 'user123',
        ...profileData
      };
      
      sinon.stub(ExpressEntryProfile, 'create').resolves(savedProfile);

      await expressEntryController.saveProfile(req, res);

      expect(res.statusCode).to.equal(201);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.profile).to.deep.equal(savedProfile);
      expect(ExpressEntryProfile.create.calledOnce).to.be.true;
    });

    it('should handle validation errors when saving profile', async function() {
      const req = httpMocks.createRequest({
        body: { /* invalid data */ },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      sinon.stub(ExpressEntryProfile, 'create').rejects(validationError);

      await expressEntryController.saveProfile(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('validation');
    });
  });

  describe('getProfile', function() {
    it('should retrieve an Express Entry profile by ID', async function() {
      const profileId = 'profile123';
      const req = httpMocks.createRequest({
        params: { id: profileId },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const mockProfile = {
        _id: profileId,
        userId: 'user123',
        age: 29,
        education: [{ level: 'bachelors' }]
      };

      sinon.stub(ExpressEntryProfile, 'findById').resolves(mockProfile);

      await expressEntryController.getProfile(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.profile).to.deep.equal(mockProfile);
      expect(ExpressEntryProfile.findById.calledWith(profileId)).to.be.true;
    });

    it('should return 404 when profile is not found', async function() {
      const req = httpMocks.createRequest({
        params: { id: 'nonexistent' },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      sinon.stub(ExpressEntryProfile, 'findById').resolves(null);

      await expressEntryController.getProfile(req, res);

      expect(res.statusCode).to.equal(404);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('not found');
    });

    it('should handle unauthorized access to profiles', async function() {
      const req = httpMocks.createRequest({
        params: { id: 'profile123' },
        user: { id: 'differentUser' }
      });
      const res = httpMocks.createResponse();

      const mockProfile = {
        _id: 'profile123',
        userId: 'user123', // Different from request user
        age: 29
      };

      sinon.stub(ExpressEntryProfile, 'findById').resolves(mockProfile);

      await expressEntryController.getProfile(req, res);

      expect(res.statusCode).to.equal(403);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('unauthorized');
    });
  });
});
