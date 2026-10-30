const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const BusinessProfile = require('../models/BusinessProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Message = require('../models/Message');

const seedData = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clean existing collections
    console.log('🧹 Purging old sample data...');
    await User.deleteMany({});
    await BusinessProfile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Wallet.deleteMany({});
    await Transaction.deleteMany({});
    await Message.deleteMany({});

    console.log('🌱 Seeding Users & Businesses...');

    // 1. Create Business User 1: The Roasted Bean
    const bizUser1 = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan@roastedbean.com',
      password: 'password123',
      role: 'BUSINESS',
      phone: '+91 98201 11223'
    });

    const bizProfile1 = await BusinessProfile.create({
      user: bizUser1._id,
      companyName: 'The Roasted Bean Cafe',
      industryCategory: 'Cafe & Restaurant',
      address: 'Shop 4, Hill Road, Bandra West',
      city: 'Mumbai',
      location: {
        type: 'Point',
        coordinates: [72.8295, 19.0596] // [lng, lat] Bandra
      },
      contactPhone: '+91 98201 11223',
      isVerified: true
    });

    // 2. Create Business User 2: Metro Supermart
    const bizUser2 = await User.create({
      name: 'Kavita Deshmukh',
      email: 'kavita@metrosupermart.com',
      password: 'password123',
      role: 'BUSINESS',
      phone: '+91 98192 44556'
    });

    const bizProfile2 = await BusinessProfile.create({
      user: bizUser2._id,
      companyName: 'Metro Supermart & Retail',
      industryCategory: 'Retail & Store',
      address: 'Station Road, Dadar West',
      city: 'Mumbai',
      location: {
        type: 'Point',
        coordinates: [72.8427, 19.0178] // Dadar
      },
      contactPhone: '+91 98192 44556',
      isVerified: true
    });

    // 3. Create Business User 3: Bhiwandi Logistics
    const bizUser3 = await User.create({
      name: 'Suresh Patil',
      email: 'suresh@bhiwandilogistics.com',
      password: 'password123',
      role: 'BUSINESS',
      phone: '+91 97654 32100'
    });

    const bizProfile3 = await BusinessProfile.create({
      user: bizUser3._id,
      companyName: 'Express Parcel Hub',
      industryCategory: 'Warehouse & Moving',
      address: 'Bhiwandi Bypass, Anjurphata',
      city: 'Bhiwandi',
      location: {
        type: 'Point',
        coordinates: [73.0632, 19.2967] // Bhiwandi
      },
      contactPhone: '+91 97654 32100',
      isVerified: true
    });

    // 4. Create Student User: Aarav Sharma
    const studentUser = await User.create({
      name: 'Aarav Sharma',
      email: 'student@nearbyhire.com',
      password: 'password123',
      role: 'STUDENT',
      phone: '+91 99887 76655',
      college: 'University of Mumbai',
      degree: 'B.Sc Computer Science, 3rd Year',
      skills: ['Barista', 'Retail Cashier', 'Event Management', 'Customer Support', 'English Fluent'],
      rating: 4.9,
      reviewCount: 6,
      completedGigs: 6,
      reliabilityScore: 98
    });

    // Student initial wallet
    const studentWallet = await Wallet.create({
      student: studentUser._id,
      balance: 1850,
      totalEarnings: 5400,
      currency: 'INR',
      payoutDetails: {
        upiId: 'aarav@okaxis',
        accountHolderName: 'Aarav Sharma'
      }
    });

    // Initial transactions
    await Transaction.create([
      {
        wallet: studentWallet._id,
        student: studentUser._id,
        amount: 650,
        type: 'credit',
        status: 'completed',
        description: 'Payment for Weekend Barista Shift at The Roasted Bean Cafe',
        currency: 'INR'
      },
      {
        wallet: studentWallet._id,
        student: studentUser._id,
        amount: 1200,
        type: 'credit',
        status: 'completed',
        description: 'Payment for Grand Wedding Usher gig',
        currency: 'INR'
      },
      {
        wallet: studentWallet._id,
        student: studentUser._id,
        amount: 500,
        type: 'withdrawal',
        status: 'completed',
        description: 'Instant UPI payout to aarav@okaxis',
        upiId: 'aarav@okaxis',
        currency: 'INR'
      }
    ]);

    console.log('🌱 Seeding Jobs & Hyperlocal Postings with ₹ INR Wages...');

    const jobs = await Job.create([
      {
        title: 'Urgent Evening Barista & Counter Staff',
        business: bizProfile1._id,
        employer: bizUser1._id,
        description: 'Looking for an enthusiastic student barista to handle coffee brewing, counter billing, and table service during peak evening rush. Free snacks included!',
        isUrgent: true,
        category: 'Cafe & Restaurant',
        wage: {
          amount: 650,
          rateType: 'per_day',
          currency: 'INR'
        },
        shiftTime: '5:00 PM – 10:00 PM (5 hrs)',
        durationHours: 5,
        location: {
          type: 'Point',
          coordinates: [72.8295, 19.0596],
          address: 'Shop 4, Hill Road, Bandra West',
          city: 'Mumbai'
        },
        requirements: ['Basic coffee knowledge', 'Customer friendly', 'Punctual'],
        positionsAvailable: 2,
        status: 'open'
      },
      {
        title: 'Urgent Weekend Billing Cashier',
        business: bizProfile2._id,
        employer: bizUser2._id,
        description: 'Need a fast-learning student for POS billing and packing assistance during high-traffic Sunday sales.',
        isUrgent: true,
        category: 'Retail & Store',
        wage: {
          amount: 800,
          rateType: 'per_day',
          currency: 'INR'
        },
        shiftTime: '11:00 AM – 7:00 PM (8 hrs)',
        durationHours: 8,
        location: {
          type: 'Point',
          coordinates: [72.8427, 19.0178],
          address: 'Station Road, Dadar West',
          city: 'Mumbai'
        },
        requirements: ['Basic computer skills', 'Fast at billing calculation'],
        positionsAvailable: 3,
        status: 'open'
      },
      {
        title: 'Banquet & Wedding Event Usher',
        business: bizProfile1._id,
        employer: bizUser1._id,
        description: 'Guest greeting, banquet coordination, and escorting guests for corporate gala dinner in Bandra.',
        isUrgent: true,
        category: 'Event Management',
        wage: {
          amount: 1200,
          rateType: 'per_day',
          currency: 'INR'
        },
        shiftTime: '6:00 PM – 12:00 AM (6 hrs)',
        durationHours: 6,
        location: {
          type: 'Point',
          coordinates: [72.8350, 19.0620],
          address: 'Linking Road Banquet Hall, Bandra',
          city: 'Mumbai'
        },
        requirements: ['Formal attire', 'Polite communication'],
        positionsAvailable: 4,
        status: 'open'
      },
      {
        title: 'Dispatch & Barcode Scanning Assistant',
        business: bizProfile3._id,
        employer: bizUser3._id,
        description: 'Assist in barcode scanning, parcel staging, and quality tagging for courier dispatches.',
        isUrgent: false,
        category: 'Warehouse & Moving',
        wage: {
          amount: 750,
          rateType: 'per_day',
          currency: 'INR'
        },
        shiftTime: '10:00 AM – 4:00 PM (6 hrs)',
        durationHours: 6,
        location: {
          type: 'Point',
          coordinates: [73.0632, 19.2967],
          address: 'Anjurphata Warehouse Zone',
          city: 'Bhiwandi'
        },
        requirements: ['Smartphone capable', 'Attention to detail'],
        positionsAvailable: 2,
        status: 'open'
      },
      {
        title: 'Class 8 & 9 Maths & Science Tutor',
        business: bizProfile2._id,
        employer: bizUser2._id,
        description: 'Part-time home tutoring gig for CBSE syllabus students. 2 sessions per week.',
        isUrgent: false,
        category: 'Tutoring & Education',
        wage: {
          amount: 400,
          rateType: 'per_hour',
          currency: 'INR'
        },
        shiftTime: 'Flexible evening hours (2 hrs)',
        durationHours: 2,
        location: {
          type: 'Point',
          coordinates: [72.8460, 19.0200],
          address: 'Shivaji Park, Dadar',
          city: 'Mumbai'
        },
        requirements: ['Good in science and mathematics', 'Patience with kids'],
        positionsAvailable: 1,
        status: 'open'
      }
    ]);

    // Create a sample accepted application for Aarav to demonstrate chat & review
    const sampleApp = await Application.create({
      job: jobs[0]._id,
      student: studentUser._id,
      employer: bizUser1._id,
      status: 'accepted',
      coverNote: 'I have 6 months experience at a local college cafe and live 1.5 km away!'
    });

    // Sample initial messages in chat
    await Message.create([
      {
        application: sampleApp._id,
        sender: studentUser._id,
        recipient: bizUser1._id,
        text: 'Hello Rohan Sir, thank you for accepting my application! What time should I arrive today?'
      },
      {
        application: sampleApp._id,
        sender: bizUser1._id,
        recipient: studentUser._id,
        text: 'Hi Aarav! Please reach by 4:45 PM for a quick 10-minute briefing on the espresso machine. See you soon!'
      }
    ]);

    console.log('✅ SEEDING COMPLETE!');
    console.log('----------------------------------------------------');
    console.log('💼 Business User:  rohan@roastedbean.com / password123');
    console.log('🎓 Student User:   student@nearbyhire.com / password123');
    console.log('📍 Seeded:         4 businesses, 5 gigs with ₹ wages, 1 live chat thread');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
