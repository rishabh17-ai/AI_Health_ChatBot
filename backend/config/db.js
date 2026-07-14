/**
 * config/db.js — MongoDB Connection
 * ────────────────────────────────────
 * Uses Mongoose to connect to MongoDB.
 * Called once from server.js at startup.
 * MONGO_URI comes from .env file.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit if DB fails to connect
  }
};

module.exports = connectDB;