const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'applied'
  },
  coverNote: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reviewFeedback: {
    type: String,
    default: ''
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
