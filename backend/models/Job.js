const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessProfile',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Cafe & Restaurant', 'Retail & Store', 'Event Management', 'Delivery & Logistics', 'Tutoring & Education', 'Warehouse & Moving', 'Other']
  },
  wage: {
    amount: {
      type: Number,
      required: [true, 'Please provide wage amount in INR']
    },
    rateType: {
      type: String,
      enum: ['per_hour', 'per_day', 'fixed'],
      default: 'per_day'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  shiftTime: {
    type: String,
    default: 'Flexible'
  },
  durationHours: {
    type: Number,
    default: 4
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  requirements: {
    type: [String],
    default: []
  },
  positionsAvailable: {
    type: Number,
    default: 1
  },
  positionsFilled: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  }
}, { timestamps: true });

JobSchema.index({ location: '2dsphere' });
JobSchema.index({ isUrgent: 1, createdAt: -1 });
JobSchema.index({ category: 1 });

module.exports = mongoose.model('Job', JobSchema);
