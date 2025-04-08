const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../../../../app');
const PNPProgram = require('../../../../models/canada/PNPProgram');
const pnpService = require('../../../../services/canada/pnpService');
const { createTestUser, generateAuthToken } = require('../../helpers/testHelpers');

describe('PNP Integration Tests', function() {
  let authToken;
  let testUser;

  before(async function() {
    testUser = await createTestUser();
    authToken = generateAuthToken(testUser);
  });

  after(async function() {
    await mongoose.connection.dropCollection('pnpprograms')
      .catch(err => {
        if (err.code !== 26) throw err;
      });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('POST /api/canada/pnp/eligibility-check', function() {
    it('should check eligibility for PNP programs with valid profile data', async function() {
      const profileData = {
        age: 35,
        education: {
          level: 'bachelors',
          country: 'India'
        },
        languageScores: {
          english: {
            speaking: 7,
            listening: 8,
            reading: 7,
            writing: 7
          }
        },
        workExperience: [
          {
            occupation: 'Software Developer',
            years: 5,
            noc: '21231'
          }
        ],
        province: 'ontario',
        connectionToProvince: true,
        netWorth: 100000
      };

      const eligibilityResult = {
        isEligible: true,
        eligiblePrograms: [
          {
            id: 'program1',
            name: 'Ontario Immigrant Nominee Program - Tech Draw',
            province: 'ontario',
            description: 'For tech workers',
            eligibilityCriteria: ['Tech work experience', 'CLB 7+']
          }
        ],
        ineligiblePrograms: [
          {
            id: 'program2',
            name: 'Ontario Immigrant Nominee Program - Masters Graduate',
            province: 'ontario',
            description: 'For masters graduates',
            eligibilityCriteria: ['Masters degree from Ontario institution'],
            reasonForIneligibility: 'Education level does not meet requirement'
          }
        ]
      };

      sinon.stub(pnpService, 'checkEligibility').resolves(eligibilityResult);

      const response = await request(app)
        .post('/api/canada/pnp/eligibility-check')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.isEligible).to.equal(eligibilityResult.isEligible);
      expect(response.body.eligiblePrograms).to.deep.equal(eligibilityResult.eligiblePrograms);
      expect(response.body.ineligiblePrograms).to.deep.equal(eligibilityResult.ineligiblePrograms);
    });

    it('should return 400 for invalid profile data', async function() {
      const invalidData = {
      };

      const response = await request(app)
        .post('/api/canada/pnp/eligibility-check')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.exist;
    });
  });

  describe('GET /api/canada/pnp/programs/:province', function() {
    it('should return programs for a specific province', async function() {
      const province = 'ontario';

      const mockPrograms = [
        {
          _id: 'program1',
          name: 'Ontario Immigrant Nominee Program - Tech Draw',
          province: 'ontario',
          description: 'For tech workers',
          eligibilityCriteria: ['Tech work experience', 'CLB 7+']
        },
        {
          _id: 'program2',
          name: 'Ontario Immigrant Nominee Program - Masters Graduate',
          province: 'ontario',
          description: 'For masters graduates',
          eligibilityCriteria: ['Masters degree from Ontario institution']
        }
      ];

      sinon.stub(pnpService, 'getProvincialPrograms').resolves(mockPrograms);

      const response = await request(app)
        .get(`/api/canada/pnp/programs/${province}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.programs).to.deep.equal(mockPrograms);
    });

    it('should return empty array when no programs are found', async function() {
      const nonExistentProvince = 'nonexistent';

      sinon.stub(pnpService, 'getProvincialPrograms').resolves([]);

      const response = await request(app)
        .get(`/api/canada/pnp/programs/${nonExistentProvince}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.programs).to.be.an('array').that.is.empty;
    });
  });

  describe('Frontend-Backend Integration', function() {
    it('should integrate with PNP eligibility checker component', async function() {
      
      const profileData = {
        age: 35,
        education: {
          level: 'bachelors',
          country: 'India'
        },
        languageScores: {
          english: {
            speaking: 7,
            listening: 8,
            reading: 7,
            writing: 7
          }
        },
        workExperience: [
          {
            occupation: 'Software Developer',
            years: 5,
            noc: '21231'
          }
        ],
        province: 'ontario',
        connectionToProvince: true,
        netWorth: 100000
      };

      const eligibilityResult = {
        isEligible: true,
        eligiblePrograms: [
          {
            id: 'program1',
            name: 'Ontario Immigrant Nominee Program - Tech Draw',
            province: 'ontario',
            description: 'For tech workers',
            eligibilityCriteria: ['Tech work experience', 'CLB 7+']
          }
        ],
        ineligiblePrograms: [
          {
            id: 'program2',
            name: 'Ontario Immigrant Nominee Program - Masters Graduate',
            province: 'ontario',
            description: 'For masters graduates',
            eligibilityCriteria: ['Masters degree from Ontario institution'],
            reasonForIneligibility: 'Education level does not meet requirement'
          }
        ]
      };

      sinon.stub(pnpService, 'checkEligibility').resolves(eligibilityResult);

      const response = await request(app)
        .post('/api/canada/pnp/eligibility-check')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.isEligible).to.equal(eligibilityResult.isEligible);
      expect(response.body.eligiblePrograms).to.deep.equal(eligibilityResult.eligiblePrograms);
      expect(response.body.ineligiblePrograms).to.deep.equal(eligibilityResult.ineligiblePrograms);
      
    });

    it('should integrate with provincial program browser component', async function() {
      
      const province = 'ontario';

      const mockPrograms = [
        {
          _id: 'program1',
          name: 'Ontario Immigrant Nominee Program - Tech Draw',
          province: 'ontario',
          description: 'For tech workers',
          eligibilityCriteria: ['Tech work experience', 'CLB 7+']
        },
        {
          _id: 'program2',
          name: 'Ontario Immigrant Nominee Program - Masters Graduate',
          province: 'ontario',
          description: 'For masters graduates',
          eligibilityCriteria: ['Masters degree from Ontario institution']
        }
      ];

      sinon.stub(pnpService, 'getProvincialPrograms').resolves(mockPrograms);

      const response = await request(app)
        .get(`/api/canada/pnp/programs/${province}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.programs).to.deep.equal(mockPrograms);
      
    });
  });
});
