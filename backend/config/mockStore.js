const bcrypt = require('bcryptjs');

class MockStore {
  constructor() {
    this.init();
  }

  init() {
    this.users = [
      {
        _id: '66eabcd10000000000000001',
        id: '66eabcd10000000000000001',
        name: 'Rohan Mehta',
        email: 'rohan@roastedbean.com',
        password: 'password123',
        role: 'BUSINESS',
        phone: '+91 98201 11223',
        skills: [],
        rating: 4.8,
        reliabilityScore: 95,
        college: '',
        businessProfile: {
          _id: '66eabcd20000000000000001',
          companyName: 'The Roasted Bean Cafe',
          industryCategory: 'Cafe & Restaurant',
          address: 'Shop 4, Hill Road, Bandra West',
          city: 'Mumbai',
          location: { type: 'Point', coordinates: [72.8295, 19.0596] },
          contactPhone: '+91 98201 11223',
          isVerified: true
        }
      },
      {
        _id: '66eabcd10000000000000004',
        id: '66eabcd10000000000000004',
        name: 'Aarav Sharma',
        email: 'student@nearbyhire.com',
        password: 'password123',
        role: 'STUDENT',
        phone: '+91 99887 76655',
        college: 'University of Mumbai',
        skills: ['Barista', 'Retail Cashier', 'Event Management', 'Customer Support', 'English Fluent'],
        rating: 4.9,
        reliabilityScore: 98,
        completedGigs: 6,
        wallet: {
          _id: '66eabcd30000000000000001',
          balance: 1850,
          totalEarnings: 5400,
          currency: 'INR',
          payoutDetails: { upiId: 'aarav@okaxis', accountHolderName: 'Aarav Sharma' }
        }
      },
      {
        _id: '66eabcd10000000000000005',
        id: '66eabcd10000000000000005',
        name: 'Umar Shaikh',
        email: 'zashaikh332211@gmail.com',
        password: 'password123',
        role: 'STUDENT',
        phone: '+91 98765 43210',
        college: 'University of Mumbai',
        skills: ['Full Stack Developer', 'React', 'Node.js', 'UI/UX Design'],
        rating: 5.0,
        reliabilityScore: 100,
        completedGigs: 8,
        wallet: {
          _id: '66eabcd30000000000000002',
          balance: 2400,
          totalEarnings: 6800,
          currency: 'INR',
          payoutDetails: { upiId: 'umar@okhdfcbank', accountHolderName: 'Umar Shaikh' }
        }
      }
    ];

    this.jobs = [
      {
        _id: '66eabcd40000000000000001',
        id: '66eabcd40000000000000001',
        title: 'Urgent Evening Barista & Counter Staff',
        business: {
          _id: '66eabcd20000000000000001',
          companyName: 'The Roasted Bean Cafe',
          industryCategory: 'Cafe & Restaurant',
          address: 'Shop 4, Hill Road, Bandra West',
          city: 'Mumbai',
          isVerified: true
        },
        employer: {
          _id: '66eabcd10000000000000001',
          name: 'Rohan Mehta',
          phone: '+91 98201 11223'
        },
        description: 'Looking for an enthusiastic student barista to handle coffee brewing, counter billing, and table service during peak evening rush. Free snacks included!',
        isUrgent: true,
        category: 'Cafe & Restaurant',
        wage: { amount: 650, rateType: 'per_day', currency: 'INR' },
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
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        _id: '66eabcd40000000000000002',
        id: '66eabcd40000000000000002',
        title: 'Urgent Weekend Billing Cashier',
        business: {
          _id: '66eabcd20000000000000002',
          companyName: 'Metro Supermart & Retail',
          industryCategory: 'Retail & Store',
          address: 'Station Road, Dadar West',
          city: 'Mumbai',
          isVerified: true
        },
        employer: {
          _id: '66eabcd10000000000000001',
          name: 'Kavita Deshmukh',
          phone: '+91 98192 44556'
        },
        description: 'Need a fast-learning student for POS billing and packing assistance during high-traffic Sunday sales.',
        isUrgent: true,
        category: 'Retail & Store',
        wage: { amount: 800, rateType: 'per_day', currency: 'INR' },
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
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        _id: '66eabcd40000000000000003',
        id: '66eabcd40000000000000003',
        title: 'Banquet & Wedding Event Usher',
        business: {
          _id: '66eabcd20000000000000001',
          companyName: 'The Roasted Bean Cafe',
          industryCategory: 'Event Management',
          address: 'Linking Road Banquet Hall, Bandra',
          city: 'Mumbai',
          isVerified: true
        },
        employer: {
          _id: '66eabcd10000000000000001',
          name: 'Rohan Mehta',
          phone: '+91 98201 11223'
        },
        description: 'Guest greeting, banquet coordination, and escorting guests for corporate gala dinner in Bandra.',
        isUrgent: true,
        category: 'Event Management',
        wage: { amount: 1200, rateType: 'per_day', currency: 'INR' },
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
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        _id: '66eabcd40000000000000004',
        id: '66eabcd40000000000000004',
        title: 'Dispatch & Barcode Scanning Assistant',
        business: {
          _id: '66eabcd20000000000000003',
          companyName: 'Express Parcel Hub',
          industryCategory: 'Warehouse & Moving',
          address: 'Anjurphata Warehouse Zone',
          city: 'Bhiwandi',
          isVerified: true
        },
        employer: {
          _id: '66eabcd10000000000000001',
          name: 'Suresh Patil',
          phone: '+91 97654 32100'
        },
        description: 'Assist in barcode scanning, parcel staging, and quality tagging for courier dispatches.',
        isUrgent: false,
        category: 'Warehouse & Moving',
        wage: { amount: 750, rateType: 'per_day', currency: 'INR' },
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
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        _id: '66eabcd40000000000000005',
        id: '66eabcd40000000000000005',
        title: 'Class 8 & 9 Maths & Science Tutor',
        business: {
          _id: '66eabcd20000000000000002',
          companyName: 'Metro Supermart & Retail',
          industryCategory: 'Tutoring & Education',
          address: 'Shivaji Park, Dadar',
          city: 'Mumbai',
          isVerified: true
        },
        employer: {
          _id: '66eabcd10000000000000001',
          name: 'Kavita Deshmukh',
          phone: '+91 98192 44556'
        },
        description: 'Part-time home tutoring gig for CBSE syllabus students. 2 sessions per week.',
        isUrgent: false,
        category: 'Tutoring & Education',
        wage: { amount: 400, rateType: 'per_hour', currency: 'INR' },
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
        status: 'open',
        createdAt: new Date().toISOString()
      }
    ];

    this.applications = [
      {
        _id: '66eabcd50000000000000001',
        id: '66eabcd50000000000000001',
        job: this.jobs[0],
        student: this.users[1],
        employer: this.users[0],
        status: 'accepted',
        coverNote: 'I have 6 months barista experience at my college cafe!',
        createdAt: new Date().toISOString()
      }
    ];

    this.transactions = [
      {
        _id: '66eabcd60000000000000001',
        amount: 650,
        type: 'credit',
        status: 'completed',
        description: 'Payment for Weekend Barista Shift at The Roasted Bean Cafe',
        currency: 'INR',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: '66eabcd60000000000000002',
        amount: 1200,
        type: 'credit',
        status: 'completed',
        description: 'Payment for Grand Wedding Usher gig',
        currency: 'INR',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }

  findUser(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    // For demo purposes, allow common demo passwords or user password
    if (password === 'password123' || password === '123456' || password === user.password || user.email.includes('shaikh')) {
      return user;
    }
    return user; // In offline demo mode, log the user in smoothly
  }

  getUserById(id) {
    return this.users.find(u => String(u._id) === String(id) || String(u.id) === String(id)) || this.users[1];
  }

  addUser(userData) {
    const newUser = {
      _id: '66eabcd1' + Date.now().toString(16).padStart(16, '0'),
      ...userData,
      id: '66eabcd1' + Date.now().toString(16).padStart(16, '0'),
      rating: 5.0,
      reliabilityScore: 100,
      skills: Array.isArray(userData.skills) ? userData.skills : (userData.skills ? userData.skills.split(',').map(s => s.trim()) : []),
      wallet: {
        balance: 0,
        totalEarnings: 0,
        currency: 'INR'
      }
    };
    this.users.push(newUser);
    return newUser;
  }

  getJobs(filters = {}) {
    let result = [...this.jobs];
    if (filters.category && filters.category !== 'All') {
      result = result.filter(j => j.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.location && j.location.city && j.location.city.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getJobById(id) {
    return this.jobs.find(j => String(j._id) === String(id) || String(j.id) === String(id));
  }

  addJob(jobData, employerUser) {
    const newJob = {
      _id: '66eabcd4' + Date.now().toString(16).padStart(16, '0'),
      ...jobData,
      employer: employerUser,
      business: employerUser.businessProfile || {
        companyName: employerUser.name + "'s Enterprise",
        city: 'Mumbai',
        isVerified: true
      },
      status: 'open',
      createdAt: new Date().toISOString()
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  applyJob(jobId, studentUser, coverNote) {
    const job = this.getJobById(jobId);
    if (!job) return null;
    const app = {
      _id: '66eabcd5' + Date.now().toString(16).padStart(16, '0'),
      job,
      student: studentUser,
      employer: job.employer,
      status: 'pending',
      coverNote: coverNote || 'Interested in this position!',
      createdAt: new Date().toISOString()
    };
    this.applications.unshift(app);
    return app;
  }

  getApplicationsByStudent(studentId) {
    return this.applications.filter(a => String(a.student?._id || a.student?.id) === String(studentId));
  }

  getWallet(userId) {
    const user = this.getUserById(userId);
    return user?.wallet || {
      balance: 1850,
      totalEarnings: 5400,
      currency: 'INR',
      payoutDetails: { upiId: 'student@upi' }
    };
  }

  getTransactions(userId) {
    return this.transactions;
  }
}

module.exports = new MockStore();
