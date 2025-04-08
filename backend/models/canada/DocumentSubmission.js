const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSubmissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caseId: {
    type: Schema.Types.ObjectId,
    ref: 'CanadianCase'
  },
  name: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: [
      'passport',
      'birthCertificate',
      'marriageCertificate',
      'educationCredential',
      'languageTest',
      'workExperience',
      'policeCheck',
      'medicalExam',
      'financialProof',
      'photoID',
      'travelHistory',
      'other'
    ],
    required: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
    default: 'Pending'
  },
  rejectionReason: String,
  reviewDate: Date,
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  aiAnalysis: {
    isComplete: Boolean,
    confidence: Number,
    missingInformation: [String],
    potentialIssues: [String],
    extractedData: Schema.Types.Mixed
  },
  metadata: {
    issueDate: Date,
    issuingAuthority: String,
    documentNumber: String,
    country: String,
    additionalInfo: Schema.Types.Mixed
  },
  tags: [String],
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

DocumentSubmissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DocumentSubmission', DocumentSubmissionSchema);
