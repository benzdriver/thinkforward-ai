const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('../../../helpers/mock-request');
const pnpController = require('../../../../controllers/canada/pnp');
const pnpService = require('../../../../services/canada/pnpService');
const PNPProgram = require('../../../../models/canada/PNPProgram');

describe('PNP Controller Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('checkEligibility', function() {
    it('should check eligibility for PNP programs with valid profile data', async function() {
      const req = httpMocks.createRequest({
        body: {
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
        }
      });
      const res = httpMocks.createResponse();

      const eligibilityResult = {
        isEligible: true,
        eligiblePrograms: [
          {
            id: 'program1',
            name: 'Ontario Immigrant Nominee Program - Tech Draw',
            score: 400,
            minimumScore: 350,
            details: 'You meet all requirements for this program'
          }
        ],
        ineligiblePrograms: [
          {
            id: 'program2',
            name: 'Ontario Immigrant Nominee Program - Masters Graduate',
            reason: 'Education level does not meet requirements'
          }
        ]
      };

      sinon.stub(pnpService, 'checkEligibility').resolves(eligibilityResult);

      await pnpController.checkEligibility(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.result).to.deep.equal(eligibilityResult);
      expect(pnpService.checkEligibility.calledOnce).to.be.true;
    });

    it('should handle errors during eligibility check', async function() {
      const req = httpMocks.createRequest({
        body: { /* incomplete data */ }
      });
      const res = httpMocks.createResponse();

      sinon.stub(pnpService, 'checkEligibility').rejects(new Error('Invalid profile data'));

      await pnpController.checkEligibility(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });

  describe('getProvincialPrograms', function() {
    it('should return programs for a specific province', async function() {
      const province = 'ontario';
      const req = httpMocks.createRequest({
        params: { province }
      });
      const res = httpMocks.createResponse();

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

      sinon.stub(PNPProgram, 'find').resolves(mockPrograms);

      await pnpController.getProvincialPrograms(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.programs).to.deep.equal(mockPrograms);
      expect(PNPProgram.find.calledWith({ province })).to.be.true;
    });

    it('should handle case when no programs are found', async function() {
      const province = 'nonexistent';
      const req = httpMocks.createRequest({
        params: { province }
      });
      const res = httpMocks.createResponse();

      sinon.stub(PNPProgram, 'find').resolves([]);

      await pnpController.getProvincialPrograms(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.programs).to.be.an('array').that.is.empty;
    });

    it('should handle database errors', async function() {
      const req = httpMocks.createRequest({
        params: { province: 'ontario' }
      });
      const res = httpMocks.createResponse();

      sinon.stub(PNPProgram, 'find').rejects(new Error('Database connection error'));

      await pnpController.getProvincialPrograms(req, res);

      expect(res.statusCode).to.equal(500);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });
});
