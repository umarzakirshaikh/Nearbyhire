const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add company/store name'],
    trim: true
  },
  registrationNumber: {
    type: String,
    default: ''
  },
  industryCategory: {
    type: String,
    enum: ['Cafe & Restaurant', 'Retail & Store', 'Event Management', 'Delivery & Logistics', 'Tutoring & Education', 'Warehouse & Moving', 'Other'],
    default: 'Retail & Store'
  },
  address: {
    type: String,
    required: [true, 'Please provide business address']
  },
  city: {
    type: String,
    required: [true, 'Please specify city']
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
    }
  },
  contactPhone: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

BusinessProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);
