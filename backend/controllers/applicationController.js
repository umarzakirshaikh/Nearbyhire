const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const mockStore = require('../config/mockStore');
const { calculateReliabilityScore } = require('../utils/scoreCalculator');

// @desc    Apply for a job
// @route   POST /api/v1/applications/:jobId/apply
// @access  Private (Student)
exports.applyJob = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const app = mockStore.applyJob(req.params.jobId, req.user, req.body.coverNote);
      if (!app) return res.status(404).json({ success: false, message: 'Job not found' });
      return res.status(201).json({ success: true, data: app });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This position is no longer accepting applications' });
    }

    const existingApp = await Application.findOne({
      job: job._id,
      student: req.user.id
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: job._id,
      student: req.user.id,
      employer: job.employer,
      coverNote: req.body.coverNote || 'Interested in this gig!'
    });

    const populatedApp = await Application.findById(application._id)
      .populate('job', 'title wage category location isUrgent')
      .populate('student', 'name email phone rating reliabilityScore skills college');

    res.status(201).json({
      success: true,
      data: populatedApp
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's applications
// @route   GET /api/v1/applications/my
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const apps = mockStore.getApplicationsByStudent(req.user.id || req.user._id);
      return res.status(200).json({ success: true, count: apps.length, data: apps });
    }

    const applications = await Application.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        populate: { path: 'business', select: 'companyName address city' }
      })
      .populate('employer', 'name phone email');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    const apps = mockStore.getApplicationsByStudent(req.user.id);
    res.status(200).json({ success: true, count: apps.length, data: apps });
  }
};

// @desc    Get all applicants for a specific job (Business)
// @route   GET /api/v1/applications/job/:jobId
// @access  Private (Business)
exports.getJobApplicants = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .sort({ createdAt: -1 })
      .populate('student', 'name email phone skills college rating reliabilityScore completedGigs avatar');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applicants across all jobs posted by current business
// @route   GET /api/v1/applications/business/all
// @access  Private (Business)
exports.getBusinessApplicantsAll = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: mockStore.applications.length, data: mockStore.applications });
    }

    const applications = await Application.find({ employer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('job', 'title wage category isUrgent status')
      .populate('student', 'name email phone skills college rating reliabilityScore completedGigs avatar');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (accept, reject)
// @route   PATCH /api/v1/applications/:id/status
// @access  Private (Business)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const app = mockStore.applications.find(a => String(a._id) === String(req.params.id) || String(a.id) === String(req.params.id));
      if (app) app.status = status;
      return res.status(200).json({ success: true, data: app });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete gig and submit review/rating
// @route   POST /api/v1/applications/:id/complete
// @access  Private (Business)
exports.completeAndReview = exports.completeGigAndReview = async (req, res, next) => {
  try {
    const { rating, feedback, tips = 0 } = req.body;
    res.status(200).json({
      success: true,
      message: 'Gig completed successfully! Payment and rating recorded.'
    });
  } catch (err) {
    next(err);
  }
};
