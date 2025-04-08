const { expect } = require('chai');
const sinon = require('sinon');
const expressEntryService = require('../../../../services/canada/expressEntryService');
const ExpressEntryProfile = require('../../../../models/canada/ExpressEntryProfile');

describe('Express Entry Service Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('calculatePoints', function() {
    it('should calculate CRS points correctly for a single applicant', function() {
      const profile = {
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
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-01-01'),
            hoursPerWeek: 40
          }
        ]
      };

      const result = expressEntryService.calculatePoints(profile);

      expect(result).to.be.an('object');
      expect(result.totalPoints).to.be.a('number');
      expect(result.breakdown).to.be.an('object');
      expect(result.breakdown.age).to.be.a('number');
      expect(result.breakdown.education).to.be.a('number');
      expect(result.breakdown.language).to.be.a('number');
      expect(result.breakdown.workExperience).to.be.a('number');
      
      const sum = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
      expect(result.totalPoints).to.equal(sum);
    });

    it('should calculate CRS points correctly for a married applicant', function() {
      const profile = {
        age: 32,
        maritalStatus: 'married',
        education: [
          {
            level: 'masters',
            institution: 'University of British Columbia',
            country: 'Canada'
          }
        ],
        languageProficiency: [
          {
            language: 'english',
            test: 'IELTS',
            speaking: 8,
            listening: 8,
            reading: 8,
            writing: 8
          }
        ],
        workExperience: [
          {
            occupation: { title: 'Financial Analyst', noc: '11103' },
            employer: 'Finance Corp',
            country: 'United States',
            isCanadianExperience: false,
            startDate: new Date('2018-01-01'),
            endDate: new Date('2023-01-01'),
            hoursPerWeek: 40
          }
        ],
        spouse: {
          education: {
            level: 'bachelors',
            country: 'Canada'
          },
          languageProficiency: {
            language: 'english',
            test: 'IELTS',
            speaking: 7,
            listening: 7,
            reading: 7,
            writing: 7
          },
          workExperience: 3 // years
        }
      };

      const result = expressEntryService.calculatePoints(profile);

      expect(result).to.be.an('object');
      expect(result.totalPoints).to.be.a('number');
      expect(result.breakdown).to.be.an('object');
      expect(result.breakdown.age).to.be.a('number');
      expect(result.breakdown.education).to.be.a('number');
      expect(result.breakdown.language).to.be.a('number');
      expect(result.breakdown.workExperience).to.be.a('number');
      expect(result.breakdown.spouseFactors).to.be.a('number');
      
      const sum = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
      expect(result.totalPoints).to.equal(sum);
    });

    it('should add additional points for Canadian education', function() {
      const profile = {
        age: 28,
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
            listening: 7,
            reading: 7,
            writing: 7
          }
        ],
        workExperience: [
          {
            occupation: { title: 'Teacher', noc: '41220' },
            employer: 'School Board',
            country: 'United Kingdom',
            isCanadianExperience: false,
            startDate: new Date('2020-01-01'),
            endDate: new Date('2023-01-01'),
            hoursPerWeek: 40
          }
        ],
        adaptabilityFactors: {
          canadianEducation: {
            has: true,
            level: 'bachelors',
            duration: 4
          }
        }
      };

      const result = expressEntryService.calculatePoints(profile);

      expect(result.breakdown.adaptability).to.be.a('number');
      expect(result.breakdown.adaptability).to.be.greaterThan(0);
    });

    it('should add additional points for provincial nomination', function() {
      const profile = {
        age: 35,
        maritalStatus: 'single',
        education: [
          {
            level: 'bachelors',
            institution: 'University of Mumbai',
            country: 'India'
          }
        ],
        languageProficiency: [
          {
            language: 'english',
            test: 'IELTS',
            speaking: 6,
            listening: 6,
            reading: 6,
            writing: 6
          }
        ],
        workExperience: [
          {
            occupation: { title: 'Civil Engineer', noc: '21300' },
            employer: 'Construction Co',
            country: 'India',
            isCanadianExperience: false,
            startDate: new Date('2015-01-01'),
            endDate: new Date('2023-01-01'),
            hoursPerWeek: 40
          }
        ],
        hasProvincialNomination: true
      };

      const result = expressEntryService.calculatePoints(profile);

      expect(result.breakdown.provincialNomination).to.equal(600);
      expect(result.totalPoints).to.be.greaterThanOrEqual(600);
    });

    it('should handle invalid profile data', function() {
      const invalidProfile = {
      };

      expect(() => expressEntryService.calculatePoints(invalidProfile)).to.throw();
    });
  });

  describe('getLatestDraws', function() {
    it('should fetch the latest Express Entry draws', async function() {
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

      

      sinon.stub(expressEntryService, 'fetchDrawsFromSource').resolves(mockDraws);

      const result = await expressEntryService.getLatestDraws();

      expect(result).to.deep.equal(mockDraws);
      expect(expressEntryService.fetchDrawsFromSource.calledOnce).to.be.true;
    });

    it('should handle errors when fetching draws', async function() {
      const error = new Error('Failed to fetch draws');
      sinon.stub(expressEntryService, 'fetchDrawsFromSource').rejects(error);

      try {
        await expressEntryService.getLatestDraws();
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('saveProfile', function() {
    it('should save a new Express Entry profile', async function() {
      const profileData = {
        userId: 'user123',
        age: 29,
        education: [{ level: 'bachelors' }]
      };

      const savedProfile = { _id: 'profile123', ...profileData };
      sinon.stub(ExpressEntryProfile, 'create').resolves(savedProfile);

      const result = await expressEntryService.saveProfile(profileData);

      expect(result).to.deep.equal(savedProfile);
      expect(ExpressEntryProfile.create.calledWith(profileData)).to.be.true;
    });

    it('should handle validation errors', async function() {
      const invalidData = {
      };

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      sinon.stub(ExpressEntryProfile, 'create').rejects(validationError);

      try {
        await expressEntryService.saveProfile(invalidData);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.name).to.equal('ValidationError');
      }
    });
  });

  describe('getProfile', function() {
    it('should retrieve a profile by ID', async function() {
      const profileId = 'profile123';

      const mockProfile = {
        _id: profileId,
        userId: 'user123',
        age: 30,
        education: [{ level: 'bachelors' }]
      };

      sinon.stub(ExpressEntryProfile, 'findById').resolves(mockProfile);

      const result = await expressEntryService.getProfile(profileId);

      expect(result).to.deep.equal(mockProfile);
      expect(ExpressEntryProfile.findById.calledWith(profileId)).to.be.true;
    });

    it('should return null when profile is not found', async function() {
      const nonExistentId = 'nonexistent';

      sinon.stub(ExpressEntryProfile, 'findById').resolves(null);

      const result = await expressEntryService.getProfile(nonExistentId);

      expect(result).to.be.null;
    });

    it('should handle database errors', async function() {
      const profileId = 'profile123';

      const dbError = new Error('Database connection error');
      sinon.stub(ExpressEntryProfile, 'findById').rejects(dbError);

      try {
        await expressEntryService.getProfile(profileId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(dbError);
      }
    });
  });
});
