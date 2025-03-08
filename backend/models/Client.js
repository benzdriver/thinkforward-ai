const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
  institution: String,
  country: String,
  degree: String,
  field: String,
  startDate: Date,
  endDate: Date,
  completed: Boolean
});

const WorkExperienceSchema = new Schema({
  employer: String,
  country: String,
  jobTitle: String,
  duties: String,
  startDate: Date,
  endDate: Date,
  isCurrentJob: Boolean,
  isProfessionalSkillType: Boolean,
  nocCode: String
});

const LanguageTestSchema = new Schema({
  testType: String,
  date: Date,
  overallScore: Number,
  reading: Number,
  writing: Number,
  listening: Number,
  speaking: Number
});

const FamilyMemberSchema = new Schema({
  relationship: {
    type: String,
    enum: ['Spouse', 'Child', 'Parent', 'Sibling', 'Other']
  },
  fullName: String,
  dateOfBirth: Date,
  citizenship: String,
  isAccompanying: Boolean,
  _id: false
});

const ClientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  consultant: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: Date,
  age: Number,
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Common-Law', 'Separated', 'Divorced', 'Widowed']
  },
  citizenship: {
    type: String,
    trim: true
  },
  currentCountry: {
    type: String,
    trim: true
  },
  highestEducation: {
    type: String,
    enum: ['None', 'High School', 'College Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD']
  },
  workExperience: [WorkExperienceSchema],
  education: [EducationSchema],
  languageTests: [LanguageTestSchema],
  immigrationHistory: {
    previousApplications: Boolean,
    applications: [{
      programType: String,
      date: Date,
      status: String,
      notes: String
    }],
    refusals: Boolean,
    refusalDetails: String
  },
  notes: String,
  tags: [String],
  profileComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ClientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

ClientSchema.methods.calculateAge = function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
};

ClientSchema.pre('save', function(next) {
  this.calculateAge();
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Client', ClientSchema); 