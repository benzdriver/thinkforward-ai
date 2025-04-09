const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const TimelineEventSchema = new Schema({
  event: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String,
  relatedDocumentId: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentSubmission'
  }
});

const CanadianCaseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: String,
  programType: {
    type: String,
    enum: [
      'Express Entry',
      'Provincial Nominee Program',
      'Family Sponsorship',
      'Study Permit',
      'Work Permit',
      'Visitor Visa',
      'Citizenship',
      'Refugee Claim',
      'Other'
    ],
    required: true
  },
  subProgramType: String,
  status: {
    type: String,
    enum: [
      'New',
      'In Progress',
      'Awaiting Documents',
      'Documents Under Review',
      'Application Preparation',
      'Application Submitted',
      'Awaiting Decision',
      'Approved',
      'Rejected',
      'On Hold',
      'Completed',
      'Cancelled'
    ],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  expressEntryProfileId: {
    type: Schema.Types.ObjectId,
    ref: 'ExpressEntryProfile'
  },
  pnpProgramId: {
    type: Schema.Types.ObjectId,
    ref: 'PNPProgram'
  },
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'DocumentSubmission'
  }],
  notes: [NoteSchema],
  timeline: [TimelineEventSchema],
  nextSteps: [String],
  deadlines: [{
    title: String,
    date: Date,
    description: String,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  aiRecommendations: [{
    title: String,
    description: String,
    impact: {
      type: String,
      enum: ['High', 'Medium', 'Low']
    },
    isImplemented: {
      type: Boolean,
      default: false
    },
    dateGenerated: {
      type: Date,
      default: Date.now
    }
  }],
  eligibilityScore: {
    score: Number,
    lastCalculated: Date,
    factors: [{
      name: String,
      score: Number,
      maxScore: Number,
      notes: String
    }]
  },
  applicationDetails: {
    applicationId: String,
    submissionDate: Date,
    estimatedProcessingTime: String,
    currentStage: String,
    decisionDate: Date,
    decision: {
      type: String,
      enum: ['Approved', 'Rejected', 'Pending']
    }
  },
  fees: [{
    description: String,
    amount: Number,
    currency: {
      type: String,
      default: 'CAD'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentDate: Date,
    paymentMethod: String,
    receiptNumber: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

CanadianCaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CanadianCase', CanadianCaseSchema);
