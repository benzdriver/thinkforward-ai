const { expect } = require('chai');
const sinon = require('sinon');
const pnpService = require('../../../../services/canada/pnpService');
const PNPProgram = require('../../../../models/canada/PNPProgram');

describe('PNP Service Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('checkEligibility', function() {
    it('should check eligibility for PNP programs with valid profile data', async function() {
      const profile = {
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

      const mockPrograms = [
        {
          _id: 'program1',
          name: 'Ontario Immigrant Nominee Program - Tech Draw',
          province: 'ontario',
          description: 'For tech workers',
          eligibilityCriteria: ['Tech work experience', 'CLB 7+'],
          ageRange: { min: 21, max: 45 },
          educationRequirement: 'bachelors',
          languageRequirement: { clbLevel: 7 },
          workExperienceRequirement: { months: 12, nocCodes: ['21231'] },
          connectionToProvinceRequired: true
        },
        {
          _id: 'program2',
          name: 'Ontario Immigrant Nominee Program - Masters Graduate',
          province: 'ontario',
          description: 'For masters graduates',
          eligibilityCriteria: ['Masters degree from Ontario institution'],
          ageRange: { min: 21, max: 45 },
          educationRequirement: 'masters',
          languageRequirement: { clbLevel: 7 },
          connectionToProvinceRequired: true
        }
      ];

      sinon.stub(PNPProgram, 'find').resolves(mockPrograms);

      const result = await pnpService.checkEligibility(profile);

      expect(result).to.be.an('object');
      expect(result.isEligible).to.be.a('boolean');
      expect(result.eligiblePrograms).to.be.an('array');
      expect(result.ineligiblePrograms).to.be.an('array');
      
      expect(result.eligiblePrograms.length).to.equal(1);
      expect(result.eligiblePrograms[0].id).to.equal('program1');
      expect(result.ineligiblePrograms.length).to.equal(1);
      expect(result.ineligiblePrograms[0].id).to.equal('program2');
    });

    it('should handle case when no programs are found', async function() {
      const profile = {
        age: 35,
        province: 'nonexistent'
      };

      sinon.stub(PNPProgram, 'find').resolves([]);

      const result = await pnpService.checkEligibility(profile);

      expect(result.isEligible).to.be.false;
      expect(result.eligiblePrograms).to.be.an('array').that.is.empty;
      expect(result.ineligiblePrograms).to.be.an('array').that.is.empty;
    });

    it('should handle database errors', async function() {
      const profile = {
        age: 35,
        province: 'ontario'
      };

      const dbError = new Error('Database connection error');
      sinon.stub(PNPProgram, 'find').rejects(dbError);

      try {
        await pnpService.checkEligibility(profile);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(dbError);
      }
    });
  });

  describe('getProvincialPrograms', function() {
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

      sinon.stub(PNPProgram, 'find').resolves(mockPrograms);

      const result = await pnpService.getProvincialPrograms(province);

      expect(result).to.deep.equal(mockPrograms);
      expect(PNPProgram.find.calledWith({ province })).to.be.true;
    });

    it('should handle case when no programs are found', async function() {
      const province = 'nonexistent';

      sinon.stub(PNPProgram, 'find').resolves([]);

      const result = await pnpService.getProvincialPrograms(province);

      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle database errors', async function() {
      const province = 'ontario';

      const dbError = new Error('Database connection error');
      sinon.stub(PNPProgram, 'find').rejects(dbError);

      try {
        await pnpService.getProvincialPrograms(province);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(dbError);
      }
    });
  });

  describe('getProgramById', function() {
    it('should return a program by ID', async function() {
      const programId = 'program123';

      const mockProgram = {
        _id: programId,
        name: 'Ontario Immigrant Nominee Program - Tech Draw',
        province: 'ontario',
        description: 'For tech workers'
      };

      sinon.stub(PNPProgram, 'findById').resolves(mockProgram);

      const result = await pnpService.getProgramById(programId);

      expect(result).to.deep.equal(mockProgram);
      expect(PNPProgram.findById.calledWith(programId)).to.be.true;
    });

    it('should return null when program is not found', async function() {
      const nonExistentId = 'nonexistent';

      sinon.stub(PNPProgram, 'findById').resolves(null);

      const result = await pnpService.getProgramById(nonExistentId);

      expect(result).to.be.null;
    });

    it('should handle database errors', async function() {
      const programId = 'program123';

      const dbError = new Error('Database connection error');
      sinon.stub(PNPProgram, 'findById').rejects(dbError);

      try {
        await pnpService.getProgramById(programId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(dbError);
      }
    });
  });
});
