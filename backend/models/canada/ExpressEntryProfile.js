const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageProficiencySchema = new Schema({
  language: {
    type: String,
    enum: ['english', 'french'],
    required: true
  },
  test: {
    type: String,
    enum: ['IELTS', 'CELPIP', 'TEF', 'TCF'],
    required: true
  },
  speaking: {
    type: Number,
    required: true,
    min: 0
  },
  listening: {
    type: Number,
    required: true,
    min: 0
  },
  reading: {
    type: Number,
    required: true,
    min: 0
  },
  writing: {
    type: Number,
    required: true,
    min: 0
  }
});

const EducationSchema = new Schema({
  level: {
    type: String,
    enum: [
      'highSchool',
      'oneYearDiploma',
      'twoYearDiploma',
      'bachelors',
      'twoOrMoreDegrees',
      'masters',
      'phd'
    ],
    required: true
  },
  field: String,
  country: String,
  completionDate: Date,
  canadianEquivalency: Boolean
});

const WorkExperienceSchema = new Schema({
  occupation: {
    title: String,
    noc: String
  },
  employer: String,
  country: String,
  isCanadianExperience: Boolean,
  startDate: Date,
  endDate: Date,
  hoursPerWeek: Number,
  duties: [String]
});

const SpouseSchema = new Schema({
  education: [EducationSchema],
  languageProficiency: [LanguageProficiencySchema],
  workExperience: [WorkExperienceSchema]
});

const ExpressEntryProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'commonLaw', 'divorced', 'separated', 'widowed'],
    required: true
  },
  education: [EducationSchema],
  languageProficiency: [LanguageProficiencySchema],
  workExperience: [WorkExperienceSchema],
  hasProvincialNomination: {
    type: Boolean,
    default: false
  },
  hasJobOffer: {
    type: Boolean,
    default: false
  },
  jobOfferDetails: {
    noc: String,
    title: String,
    employer: String,
    province: String,
    isLMIAExempt: Boolean
  },
  hasSiblingInCanada: {
    type: Boolean,
    default: false
  },
  hasCanadianEducation: {
    type: Boolean,
    default: false
  },
  hasFrenchProficiency: {
    type: Boolean,
    default: false
  },
  spouse: SpouseSchema,
  crsScore: Number,
  lastCalculated: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ExpressEntryProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ExpressEntryProfile', ExpressEntryProfileSchema);
