const { expect } = require('chai');
const mongoose = require('mongoose');
const PNPProgram = require('../../../../models/canada/PNPProgram');

describe('PNP Program Model Tests', function() {
  before(function() {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  after(function() {
    return mongoose.connection.dropCollection('pnpprograms')
      .catch(err => {
        if (err.code !== 26) throw err;
      });
  });

  it('should create a valid PNP program', async function() {
    const programData = {
      name: 'Ontario Immigrant Nominee Program - Tech Draw',
      province: 'ontario',
      description: 'Program for tech workers with job offers in Ontario',
      eligibilityCriteria: [
        'Job offer in tech sector',
        'CLB 7 or higher in English or French',
        'Equivalent of Canadian bachelor\'s degree or higher',
        'Minimum 1 year of work experience in tech occupation'
      ],
      ageRange: {
        min: 21,
        max: 55
      },
      educationRequirement: 'bachelors',
      languageRequirement: {
        clbLevel: 7,
        specificTest: 'IELTS'
      },
      workExperienceRequirement: {
        months: 12,
        nocCodes: ['21231', '21233', '21234'],
        specificOccupations: ['Software Developer', 'Web Developer', 'Software Engineer']
      },
      connectionToProvinceRequired: true,
      jobOfferRequired: true,
      netWorthRequirement: 0,
      businessExperienceRequired: false,
      processingTime: '3-6 months',
      applicationFee: 1500,
      streamType: 'express_entry',
      expressEntryLinked: true,
      quotaPerYear: 1000,
      lastDrawDate: new Date('2023-11-15'),
      lastDrawScore: 450,
      website: 'https://www.ontario.ca/page/oinp',
      contactEmail: 'oinp@ontario.ca',
      contactPhone: '416-555-1234',
      notes: 'Priority processing for tech occupations',
      isActive: true
    };

    const program = new PNPProgram(programData);
    const savedProgram = await program.save();

    expect(savedProgram).to.have.property('_id');
    expect(savedProgram.name).to.equal(programData.name);
    expect(savedProgram.province).to.equal(programData.province);
    expect(savedProgram.description).to.equal(programData.description);
    expect(savedProgram.eligibilityCriteria).to.deep.equal(programData.eligibilityCriteria);
    expect(savedProgram.ageRange).to.deep.include(programData.ageRange);
    expect(savedProgram.educationRequirement).to.equal(programData.educationRequirement);
    expect(savedProgram.languageRequirement).to.deep.include(programData.languageRequirement);
    expect(savedProgram.workExperienceRequirement).to.deep.include(programData.workExperienceRequirement);
    expect(savedProgram.connectionToProvinceRequired).to.equal(programData.connectionToProvinceRequired);
    expect(savedProgram.jobOfferRequired).to.equal(programData.jobOfferRequired);
    expect(savedProgram.streamType).to.equal(programData.streamType);
    expect(savedProgram.expressEntryLinked).to.equal(programData.expressEntryLinked);
    expect(savedProgram.isActive).to.equal(programData.isActive);
    expect(savedProgram.createdAt).to.be.instanceOf(Date);
    expect(savedProgram.updatedAt).to.be.instanceOf(Date);
  });

  it('should require name field', async function() {
    const programWithoutName = new PNPProgram({
      province: 'ontario',
      description: 'Test program'
    });

    try {
      await programWithoutName.save();
      expect.fail('Expected validation error for missing name');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.name).to.exist;
    }
  });

  it('should require province field', async function() {
    const programWithoutProvince = new PNPProgram({
      name: 'Test Program',
      description: 'Test program'
    });

    try {
      await programWithoutProvince.save();
      expect.fail('Expected validation error for missing province');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.province).to.exist;
    }
  });

  it('should validate province enum values', async function() {
    const programWithInvalidProvince = new PNPProgram({
      name: 'Test Program',
      province: 'invalid_province',
      description: 'Test program'
    });

    try {
      await programWithInvalidProvince.save();
      expect.fail('Expected validation error for invalid province');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.province).to.exist;
    }
  });

  it('should validate streamType enum values', async function() {
    const programWithInvalidStreamType = new PNPProgram({
      name: 'Test Program',
      province: 'ontario',
      description: 'Test program',
      streamType: 'invalid_stream'
    });

    try {
      await programWithInvalidStreamType.save();
      expect.fail('Expected validation error for invalid streamType');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.streamType).to.exist;
    }
  });

  it('should update timestamps on save', async function() {
    const program = new PNPProgram({
      name: 'Initial Program',
      province: 'ontario',
      description: 'Initial description'
    });
    
    const savedProgram = await program.save();
    const initialUpdatedAt = savedProgram.updatedAt;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    savedProgram.description = 'Updated description';
    const updatedProgram = await savedProgram.save();
    
    expect(updatedProgram.updatedAt).to.be.instanceOf(Date);
    expect(updatedProgram.updatedAt.getTime()).to.be.greaterThan(initialUpdatedAt.getTime());
  });
});
