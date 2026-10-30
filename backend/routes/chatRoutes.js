const express = require('express');
const router = express.Router();
const { getConversation, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:applicationId', protect, getConversation);
router.post('/:applicationId', protect, sendMessage);

module.exports = router;
