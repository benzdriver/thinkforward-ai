const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimelineEventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Planned', 'InProgress', 'Completed', 'Delayed', 'Canceled'],
    default: 'Planned'
  },
  isKeyMilestone: {
    type: Boolean,
    default: false
  },
  completedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  _id: false
});

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  deadline: Date,
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['NotStarted', 'InProgress', 'Completed', 'Overdue'],
    default: 'NotStarted'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  completedAt: Date,
  completedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  _id: false
});

const ApplicationSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  consultant: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  applicationType: {
    type: String,
    enum: [
      'ExpressEntry', 'ProvincialNominee', 'FamilySponsorship', 
      'StudyPermit', 'WorkPermit', 'BusinessImmigration', 
      'VisitorVisa', 'Citizenship', 'Refugee', 'Other'
    ],
    required: true
  },
  subType: String,
  country: {
    type: String,
    default: 'CA'
  },
  fileNumber: String,
  uci: String,
  status: {
    type: String,
    enum: [
      'Planning', 'DocumentCollection', 'FormPreparation', 'UnderReview',
      'Submitted', 'Pending', 'ApprovedInPrinciple', 'AdditionalDocsRequested',
      'Interview', 'Approved', 'Refused', 'Appealing', 'Withdrawn', 'Completed'
    ],
    default: 'Planning'
  },
  submissionDate: Date,
  estimatedProcessingTime: String,
  actualProcessingTime: Number,
  documents: [{
    name: String,
    type: String,
    required: Boolean,
    status: {
      type: String,
      enum: ['Missing', 'InProgress', 'Received', 'Verified', 'Submitted'],
      default: 'Missing'
    },
    fileUrl: String,
    notes: String,
    _id: false
  }],
  forms: [{
    name: String,
    formType: String,
    status: {
      type: String,
      enum: ['NotStarted', 'InProgress', 'Completed', 'Submitted'],
      default: 'NotStarted'
    },
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    data: Schema.Types.Mixed,
    _id: false
  }],
  timeline: [TimelineEventSchema],
  tasks: [TaskSchema],
  notes: [{
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    _id: false
  }],
  fees: {
    consultingFee: Number,
    governmentFee: Number,
    otherFees: Number,
    currency: {
      type: String,
      default: 'CAD'
    },
    isPaid: {
      type: Boolean,
      default: false
    }
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

// 更新updatedAt时间戳
ApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema); 