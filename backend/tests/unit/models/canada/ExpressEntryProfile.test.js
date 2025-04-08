const { expect } = require('chai');
const mongoose = require('mongoose');
const ExpressEntryProfile = require('../../../../models/canada/ExpressEntryProfile');

describe('Express Entry Profile Model Tests', function() {
  before(function() {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  after(function() {
    return mongoose.connection.dropCollection('expressEntryProfiles')
      .catch(err => {
        if (err.code !== 26) throw err;
      });
  });

  it('should create a valid Express Entry profile', async function() {
    const profileData = {
      userId: new mongoose.Types.ObjectId(),
      age: 30,
      maritalStatus: 'single',
      education: [
        {
          level: 'bachelors',
          institution: 'University of Toronto',
          country: 'Canada',
          fieldOfStudy: 'Computer Science',
          startDate: new Date('2015-09-01'),
          endDate: new Date('2019-05-01'),
          hasECA: true
        }
      ],
      languageProficiency: [
        {
          language: 'english',
          test: 'IELTS',
          speaking: 7,
          listening: 8,
          reading: 7,
          writing: 7,
          testDate: new Date('2023-01-15')
        }
      ],
      workExperience: [
        {
          occupation: {
            title: 'Software Developer',
            noc: '21231',
            skillLevel: 'A'
          },
          employer: 'Tech Company',
          country: 'Canada',
          isCanadianExperience: true,
          startDate: new Date('2019-06-01'),
          endDate: new Date('2023-06-01'),
          hoursPerWeek: 40,
          description: 'Developed web applications'
        }
      ],
      hasProvincialNomination: false,
      hasJobOffer: true,
      jobOfferDetails: {
        noc: '21231',
        title: 'Senior Software Developer',
        employer: 'Canadian Tech Inc.',
        location: 'Toronto, ON',
        salary: 95000,
        isLMIAExempt: false
      }
    };

    const profile = new ExpressEntryProfile(profileData);
    const savedProfile = await profile.save();

    expect(savedProfile).to.have.property('_id');
    expect(savedProfile.userId).to.equal(profileData.userId);
    expect(savedProfile.age).to.equal(profileData.age);
    expect(savedProfile.maritalStatus).to.equal(profileData.maritalStatus);
    expect(savedProfile.education).to.be.an('array').with.lengthOf(1);
    expect(savedProfile.languageProficiency).to.be.an('array').with.lengthOf(1);
    expect(savedProfile.workExperience).to.be.an('array').with.lengthOf(1);
    expect(savedProfile.hasProvincialNomination).to.equal(profileData.hasProvincialNomination);
    expect(savedProfile.hasJobOffer).to.equal(profileData.hasJobOffer);
    expect(savedProfile.jobOfferDetails).to.deep.include(profileData.jobOfferDetails);
    expect(savedProfile.createdAt).to.be.instanceOf(Date);
    expect(savedProfile.updatedAt).to.be.instanceOf(Date);
  });

  it('should require userId field', async function() {
    const profileWithoutUserId = new ExpressEntryProfile({
      age: 30,
      maritalStatus: 'single'
    });

    try {
      await profileWithoutUserId.save();
      expect.fail('Expected validation error for missing userId');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.userId).to.exist;
    }
  });

  it('should validate age range', async function() {
    const profileWithInvalidAge = new ExpressEntryProfile({
      userId: new mongoose.Types.ObjectId(),
      age: 65, // Assuming max age is 64 for Express Entry
      maritalStatus: 'single'
    });

    try {
      await profileWithInvalidAge.save();
      expect.fail('Expected validation error for invalid age');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.age).to.exist;
    }
  });

  it('should validate language proficiency scores', async function() {
    const profileWithInvalidLanguageScore = new ExpressEntryProfile({
      userId: new mongoose.Types.ObjectId(),
      age: 30,
      maritalStatus: 'single',
      languageProficiency: [
        {
          language: 'english',
          test: 'IELTS',
          speaking: 10, // Invalid score (IELTS max is 9)
          listening: 8,
          reading: 7,
          writing: 7
        }
      ]
    });

    try {
      await profileWithInvalidLanguageScore.save();
      expect.fail('Expected validation error for invalid language score');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors['languageProficiency.0.speaking']).to.exist;
    }
  });

  it('should update timestamps on save', async function() {
    const profile = new ExpressEntryProfile({
      userId: new mongoose.Types.ObjectId(),
      age: 30,
      maritalStatus: 'single'
    });
    
    const savedProfile = await profile.save();
    const initialUpdatedAt = savedProfile.updatedAt;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    savedProfile.age = 31;
    const updatedProfile = await savedProfile.save();
    
    expect(updatedProfile.updatedAt).to.be.instanceOf(Date);
    expect(updatedProfile.updatedAt.getTime()).to.be.greaterThan(initialUpdatedAt.getTime());
  });
});
