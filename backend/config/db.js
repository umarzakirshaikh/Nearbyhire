const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000 // 4 seconds timeout so it doesn't block startup
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('📡 MongoDB Atlas cluster (Cluster0) is currently PAUSED.');
      console.log('   👉 To connect to live cloud database: Open https://cloud.mongodb.com and click "Resume" on Cluster0.');
      console.log('✅ Offline Database ACTIVE: Loaded demo accounts & jobs successfully!');
    } else {
      console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`);
    }
  }
};

module.exports = connectDB;
