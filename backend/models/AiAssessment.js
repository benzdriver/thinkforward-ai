const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EligibilityFactorSchema = new Schema({
  factor: {
    type: String,
    required: true
  },
  score: {
    type: Number
  },
  assessment: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  _id: false
});

const ProgramRecommendationSchema = new Schema({
  program: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  eligibilityScore: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  strengths: [String],
  weaknesses: [String],
  requirements: [String],
  nextSteps: [String],
  _id: false
});

const AiAssessmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile: {
    demographics: {
      age: Number,
      maritalStatus: String,
      nationality: String,
      currentCountry: String,
      intendedDestination: String
    },
    education: {
      highestDegree: String,
      fieldOfStudy: String,
      institution: String,
      graduationYear: Number
    },
    workExperience: {
      yearsOfExperience: Number,
      occupation: String,
      skills: [String]
    },
    languages: [{
      language: String,
      proficiency: {
        speaking: String,
        listening: String,
        reading: String,
        writing: String
      }
    }],
    financials: {
      netWorth: {
        currency: String,
        amount: Number
      },
      dependents: Number
    }
  },
  eligibilityFactors: [EligibilityFactorSchema],
  recommendedPrograms: [ProgramRecommendationSchema],
  overallEligibilityScore: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    enum: ['en', 'zh'],
    default: 'en'
  },
  relatedChatId: {
    type: Schema.Types.ObjectId,
    ref: 'AiChat'
  }
});

module.exports = mongoose.model('AiAssessment', AiAssessmentSchema); 