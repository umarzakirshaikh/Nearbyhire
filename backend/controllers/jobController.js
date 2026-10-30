const mongoose = require('mongoose');
const Job = require('../models/Job');
const BusinessProfile = require('../models/BusinessProfile');
const mockStore = require('../config/mockStore');

// @desc    Get nearby jobs based on user's coordinates and distance radius
// @route   GET /api/v1/jobs/nearby
// @access  Public
exports.getNearbyJobs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const jobs = mockStore.getJobs(req.query);
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    }

    const { lng, lat, distance = 10, category, search } = req.query;

    let query = { status: 'open' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const maxDistanceMeters = parseFloat(distance) * 1000;
    let jobs;

    if (lng && lat && !isNaN(parseFloat(lng)) && !isNaN(parseFloat(lat))) {
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistanceMeters
        }
      };

      jobs = await Job.find(query)
        .populate('business', 'companyName industryCategory address city isVerified')
        .populate('employer', 'name phone avatar');
    } else {
      jobs = await Job.find(query)
        .sort({ isUrgent: -1, createdAt: -1 })
        .populate('business', 'companyName industryCategory address city isVerified')
        .populate('employer', 'name phone avatar');
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    // If geo error, fallback to non-geo query
    try {
      const fallbackJobs = await Job.find({ status: 'open' })
        .sort({ isUrgent: -1, createdAt: -1 })
        .populate('business', 'companyName industryCategory address city isVerified')
        .populate('employer', 'name phone avatar');
      return res.status(200).json({ success: true, count: fallbackJobs.length, data: fallbackJobs });
    } catch (e) {
      const mockJobs = mockStore.getJobs(req.query);
      return res.status(200).json({ success: true, count: mockJobs.length, data: mockJobs });
    }
  }
};

// @desc    Get urgent hiring jobs
// @route   GET /api/v1/jobs/urgent
// @access  Public
exports.getUrgentJobs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const jobs = mockStore.jobs.filter(j => j.isUrgent);
      return res.status(200).json({ success: true, count: jobs.length, data: jobs });
    }

    const jobs = await Job.find({ isUrgent: true, status: 'open' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('business', 'companyName industryCategory address city isVerified')
      .populate('employer', 'name phone avatar');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    const jobs = mockStore.jobs.filter(j => j.isUrgent);
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  }
};

// @desc    Get job details by ID
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const job = mockStore.getJobById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
      return res.status(200).json({ success: true, data: job });
    }

    const job = await Job.findById(req.params.id)
      .populate('business', 'companyName industryCategory address city isVerified contactPhone contactEmail')
      .populate('employer', 'name email phone avatar');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    const job = mockStore.getJobById(req.params.id);
    if (job) return res.status(200).json({ success: true, data: job });
    next(err);
  }
};

// @desc    Post a new job (Business only)
// @route   POST /api/v1/jobs
// @access  Private (Business)
exports.createJob = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const job = mockStore.addJob(req.body, req.user);
      return res.status(201).json({ success: true, data: job });
    }

    const business = await BusinessProfile.findOne({ user: req.user.id });
    if (!business) {
      return res.status(400).json({ success: false, message: 'No business profile found for this user' });
    }

    const {
      title,
      description,
      isUrgent,
      category,
      wageAmount,
      wageRateType = 'per_day',
      shiftTime,
      durationHours,
      address,
      city,
      coordinates,
      requirements,
      positionsAvailable
    } = req.body;

    const jobCoordinates = coordinates && coordinates.length === 2
      ? [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
      : business.location.coordinates;

    const job = await Job.create({
      title,
      description,
      business: business._id,
      employer: req.user.id,
      isUrgent: Boolean(isUrgent),
      category,
      wage: {
        amount: parseFloat(wageAmount),
        rateType: wageRateType,
        currency: 'INR'
      },
      shiftTime: shiftTime || 'Flexible shift',
      durationHours: durationHours ? parseInt(durationHours) : 4,
      location: {
        type: 'Point',
        coordinates: jobCoordinates,
        address: address || business.address,
        city: city || business.city
      },
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : []),
      positionsAvailable: positionsAvailable ? parseInt(positionsAvailable) : 1
    });

    const populatedJob = await Job.findById(job._id)
      .populate('business', 'companyName industryCategory address city isVerified')
      .populate('employer', 'name phone');

    res.status(201).json({
      success: true,
      data: populatedJob
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all jobs posted by current business employer
// @route   GET /api/v1/jobs/my/listings
// @access  Private (Business)
exports.getMyBusinessJobs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const jobs = mockStore.jobs.filter(j => String(j.employer?._id || j.employer?.id) === String(req.user.id || req.user._id));
      return res.status(200).json({ success: true, count: jobs.length, data: jobs });
    }

    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('business', 'companyName city');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update or close a job
// @route   PUT /api/v1/jobs/:id
// @access  Private (Business)
exports.updateJob = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const job = mockStore.getJobById(req.params.id);
      if (job) Object.assign(job, req.body);
      return res.status(200).json({ success: true, data: job });
    }

    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Business)
exports.deleteJob = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockStore.jobs = mockStore.jobs.filter(j => String(j._id || j.id) !== String(req.params.id));
      return res.status(200).json({ success: true, message: 'Job removed successfully' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Job removed successfully' });
  } catch (err) {
    next(err);
  }
};
