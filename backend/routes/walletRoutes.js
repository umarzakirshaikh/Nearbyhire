const express = require('express');
const router = express.Router();
const { getWalletBalance, getTransactions, withdrawUPI } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/balance', protect, authorize('STUDENT'), getWalletBalance);
router.get('/transactions', protect, authorize('STUDENT'), getTransactions);
router.post('/withdraw', protect, authorize('STUDENT'), withdrawUPI);

module.exports = router;
