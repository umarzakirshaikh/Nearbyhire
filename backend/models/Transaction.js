const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  type: {
    type: String,
    enum: ['credit', 'withdrawal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  description: {
    type: String,
    required: true
  },
  upiId: {
    type: String,
    default: ''
  },
  referenceId: {
    type: String,
    default: () => 'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
  }
}, { timestamps: true });

TransactionSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
