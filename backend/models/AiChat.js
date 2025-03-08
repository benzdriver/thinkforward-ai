const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    enum: ['en', 'zh'],
    default: 'en'
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  _id: false
});

const AiChatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chatType: {
    type: String,
    enum: ['General', 'Assessment', 'FormHelper', 'DocumentReview'],
    default: 'General'
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  relatedFormId: {
    type: Schema.Types.ObjectId,
    ref: 'Form'
  },
  relatedClientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  summary: String
});

// 更新updatedAt时间戳
AiChatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AiChat', AiChatSchema); 