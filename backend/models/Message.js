const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

MessageSchema.index({ application: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
