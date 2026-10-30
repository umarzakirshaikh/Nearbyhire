const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BusinessProfile = require('../models/BusinessProfile');
const Wallet = require('../models/Wallet');
const mockStore = require('../config/mockStore');

const getJwtToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'nearbyhire_super_secret_jwt_key_993847291038472918374',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register a new Student or Business user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'STUDENT',
      phone,
      college,
      skills,
      companyName,
      industryCategory,
      address,
      city,
      coordinates
    } = req.body;

    // If offline / Atlas not connected, use mockStore
    if (mongoose.connection.readyState !== 1) {
      const existingUser = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = mockStore.addUser({
        name,
        email,
        password,
        role,
        phone,
        college: college || '',
        skills,
        businessProfile: role === 'BUSINESS' ? {
          companyName: companyName || `${name}'s Business`,
          industryCategory: industryCategory || 'Retail & Store',
          address: address || 'Main Road, Market Area',
          city: city || 'Mumbai',
          location: { type: 'Point', coordinates: coordinates || [72.8777, 19.0760] },
          contactPhone: phone || '',
          isVerified: true
        } : null
      });

      const token = getJwtToken(user._id, user.role);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          college: user.college,
          businessProfile: user.businessProfile,
          wallet: user.wallet
        }
      });
    }

    // Live MongoDB connection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      college: college || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    });

    let businessProfile = null;
    let wallet = null;

    if (role === 'BUSINESS') {
      businessProfile = await BusinessProfile.create({
        user: user._id,
        companyName: companyName || `${name}'s Business`,
        industryCategory: industryCategory || 'Retail & Store',
        address: address || 'Main Road, Market Area',
        city: city || 'Mumbai',
        location: {
          type: 'Point',
          coordinates: coordinates || [72.8777, 19.0760]
        },
        contactPhone: phone || ''
      });
    } else {
      wallet = await Wallet.create({
        student: user._id,
        balance: 0,
        totalEarnings: 0
      });
    }

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        college: user.college,
        businessProfile,
        wallet
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // If offline / Atlas disconnected: use mockStore
    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.findUser(email, password);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Demo logins: student@nearbyhire.com or rohan@roastedbean.com (password: password123)'
        });
      }

      const token = getJwtToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          reliabilityScore: user.reliabilityScore,
          rating: user.rating,
          college: user.college,
          businessProfile: user.businessProfile,
          wallet: user.wallet
        }
      });
    }

    // Live MongoDB
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let businessProfile = null;
    let wallet = null;

    if (user.role === 'BUSINESS') {
      businessProfile = await BusinessProfile.findOne({ user: user._id });
    } else {
      wallet = await Wallet.findOne({ student: user._id });
      if (!wallet) {
        wallet = await Wallet.create({ student: user._id });
      }
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        reliabilityScore: user.reliabilityScore,
        rating: user.rating,
        college: user.college,
        businessProfile,
        wallet
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.getUserById(req.user.id || req.user._id);
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          skills: user.skills,
          reliabilityScore: user.reliabilityScore,
          rating: user.rating,
          college: user.college,
          businessProfile: user.businessProfile,
          wallet: user.wallet
        }
      });
    }

    const user = await User.findById(req.user.id);
    let businessProfile = null;
    let wallet = null;

    if (user.role === 'BUSINESS') {
      businessProfile = await BusinessProfile.findOne({ user: user._id });
    } else {
      wallet = await Wallet.findOne({ student: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        reliabilityScore: user.reliabilityScore,
        rating: user.rating,
        reviewCount: user.reviewCount,
        completedGigs: user.completedGigs,
        college: user.college,
        businessProfile,
        wallet
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.getUserById(req.user.id || req.user._id);
      Object.assign(user, req.body);
      return res.status(200).json({ success: true, user });
    }

    const fieldsToUpdate = {};
    const { name, phone, bio, college, skills } = req.body;

    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (bio) fieldsToUpdate.bio = bio;
    if (college) fieldsToUpdate.college = college;
    if (skills) {
      fieldsToUpdate.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};
