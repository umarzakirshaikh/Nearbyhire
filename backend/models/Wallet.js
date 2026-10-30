const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0.0
  },
  totalEarnings: {
    type: Number,
    default: 0.0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  payoutDetails: {
    upiId: {
      type: String,
      trim: true,
      default: ''
    },
    accountNumber: {
      type: String,
      default: ''
    },
    ifscCode: {
      type: String,
      default: ''
    },
    accountHolderName: {
      type: String,
      default: ''
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
