const Message = require('../models/Message');
const Application = require('../models/Application');

// @desc    Get messages for an application conversation
// @route   GET /api/v1/chat/:applicationId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('job', 'title')
      .populate('student', 'name avatar')
      .populate('employer', 'name avatar');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application conversation not found' });
    }

    // Check if requester is participant
    const isStudent = application.student._id.toString() === req.user.id;
    const isEmployer = application.employer._id.toString() === req.user.id;

    if (!isStudent && !isEmployer) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ application: applicationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name role avatar')
      .populate('recipient', 'name role avatar');

    res.status(200).json({
      success: true,
      data: {
        application,
        messages
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send message via HTTP fallback
// @route   POST /api/v1/chat/:applicationId
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const recipientId = application.student.toString() === req.user.id
      ? application.employer
      : application.student;

    const message = await Message.create({
      application: applicationId,
      sender: req.user.id,
      recipient: recipientId,
      text: text.trim()
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name role avatar')
      .populate('recipient', 'name role avatar');

    res.status(201).json({
      success: true,
      data: populatedMsg
    });
  } catch (err) {
    next(err);
  }
};
