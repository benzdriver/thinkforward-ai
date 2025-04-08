const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PNPProgramSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true,
    enum: [
      'ontario',
      'british_columbia',
      'alberta',
      'quebec',
      'manitoba',
      'saskatchewan',
      'nova_scotia',
      'new_brunswick',
      'prince_edward_island',
      'newfoundland_and_labrador',
      'yukon',
      'northwest_territories',
      'nunavut'
    ]
  },
  description: {
    type: String,
    required: true
  },
  eligibilityCriteria: [String],
  ageRange: {
    min: Number,
    max: Number
  },
  educationRequirement: {
    type: String,
    enum: [
      'highSchool',
      'oneYearDiploma',
      'twoYearDiploma',
      'bachelors',
      'twoOrMoreDegrees',
      'masters',
      'phd'
    ]
  },
  languageRequirement: {
    clbLevel: Number,
    specificTest: {
      type: String,
      enum: ['IELTS', 'CELPIP', 'TEF', 'TCF']
    }
  },
  workExperienceRequirement: {
    months: Number,
    nocCodes: [String],
    specificOccupations: [String]
  },
  connectionToProvinceRequired: {
    type: Boolean,
    default: false
  },
  jobOfferRequired: {
    type: Boolean,
    default: false
  },
  netWorthRequirement: Number,
  businessExperienceRequired: {
    type: Boolean,
    default: false
  },
  processingTime: String,
  applicationFee: Number,
  streamType: {
    type: String,
    enum: [
      'skilled_worker',
      'express_entry',
      'business',
      'entrepreneur',
      'international_graduate',
      'semi_skilled_worker',
      'family',
      'community',
      'rural'
    ]
  },
  expressEntryLinked: {
    type: Boolean,
    default: false
  },
  quotaPerYear: Number,
  lastDrawDate: Date,
  lastDrawScore: Number,
  website: String,
  contactEmail: String,
  contactPhone: String,
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PNPProgramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PNPProgram', PNPProgramSchema);
