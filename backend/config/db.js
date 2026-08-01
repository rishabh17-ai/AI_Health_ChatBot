/**
 * config/db.js — MongoDB Connection
 * ────────────────────────────────────
 * Uses Mongoose to connect to MongoDB.
 * Called once from server.js at startup.
 * MONGO_URI comes from .env file.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/health-chatbot';

  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Atlas connection failed: ${error.message}`);
    console.log('🔄 Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/health-chatbot)...');
    try {
      const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
    } catch (localErr) {
      console.error(`❌ Local MongoDB Connection Error: ${localErr.message}`);
      console.error(`Please ensure your IP is whitelisted on MongoDB Atlas or start local MongoDB.`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;