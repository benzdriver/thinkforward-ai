const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'date', 'select', 'radio', 'checkbox', 'textarea', 'file'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [String],
  validation: {
    type: String
  },
  helpText: {
    type: String
  },
  _id: false
});

const FormSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  formType: {
    type: String,
    enum: ['assessment', 'application', 'questionnaire', 'document'],
    required: true
  },
  fields: [FieldSchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['general', 'express-entry', 'pnp', 'family', 'business', 'temporary']
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
FormSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Form', FormSchema); 