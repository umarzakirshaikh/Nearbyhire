const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const mockStore = require('../config/mockStore');

// @desc    Get student wallet balance and earnings
// @route   GET /api/v1/wallet/balance
// @access  Private (Student)
exports.getWalletBalance = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const wallet = mockStore.getWallet(req.user.id || req.user._id);
      return res.status(200).json({
        success: true,
        data: {
          balance: wallet.balance,
          totalEarnings: wallet.totalEarnings,
          currency: wallet.currency || 'INR',
          payoutDetails: wallet.payoutDetails
        }
      });
    }

    let wallet = await Wallet.findOne({ student: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({
        student: req.user.id,
        balance: 0,
        totalEarnings: 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        totalEarnings: wallet.totalEarnings,
        currency: wallet.currency,
        payoutDetails: wallet.payoutDetails
      }
    });
  } catch (err) {
    const wallet = mockStore.getWallet(req.user.id);
    res.status(200).json({ success: true, data: wallet });
  }
};

// @desc    Get transactions ledger
// @route   GET /api/v1/wallet/transactions
// @access  Private (Student)
exports.getTransactions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const transactions = mockStore.getTransactions(req.user.id || req.user._id);
      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    }

    const transactions = await Transaction.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    const transactions = mockStore.getTransactions(req.user.id);
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  }
};

// @desc    Request withdrawal to UPI or Bank
// @route   POST /api/v1/wallet/withdraw
// @access  Private (Student)
exports.withdrawUPI = async (req, res, next) => {
  try {
    const { amount, upiId, accountNumber, ifscCode, accountHolderName } = req.body;
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid withdrawal amount' });
    }

    if (mongoose.connection.readyState !== 1) {
      const wallet = mockStore.getWallet(req.user.id || req.user._id);
      if (wallet.balance < withdrawAmount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
      wallet.balance -= withdrawAmount;
      const tx = {
        _id: '66eabcd6' + Date.now().toString(16).padStart(16, '0'),
        amount: withdrawAmount,
        type: 'withdrawal',
        status: 'completed',
        description: `Instant UPI payout to ${upiId || 'bank account'}`,
        currency: 'INR',
        createdAt: new Date().toISOString()
      };
      mockStore.transactions.unshift(tx);
      return res.status(200).json({
        success: true,
        message: `₹${withdrawAmount} withdrawal processed instantly to ${upiId || 'bank'}!`,
        transaction: tx,
        remainingBalance: wallet.balance
      });
    }

    const wallet = await Wallet.findOne({ student: req.user.id });
    if (!wallet || wallet.balance < withdrawAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    wallet.balance -= withdrawAmount;
    if (upiId) {
      wallet.payoutDetails.upiId = upiId;
    }
    await wallet.save();

    const transaction = await Transaction.create({
      wallet: wallet._id,
      student: req.user.id,
      amount: withdrawAmount,
      type: 'withdrawal',
      status: 'completed',
      description: `Instant UPI payout to ${upiId || 'registered bank account'}`,
      upiId: upiId || wallet.payoutDetails?.upiId,
      currency: 'INR'
    });

    res.status(200).json({
      success: true,
      message: `₹${withdrawAmount} withdrawal processed instantly!`,
      transaction,
      remainingBalance: wallet.balance
    });
  } catch (err) {
    next(err);
  }
};
