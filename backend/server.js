/**
 * server.js — Main Express Server
 * ──────────────────────────────────
 * Entry point for the Health Chatbot Backend API.
 *
 * Features:
 *  - Express.js web server
 *  - MongoDB connection via Mongoose
 *  - JWT authentication middleware
 *  - CORS enabled for frontend
 *  - Health & chat API routes
 *
 * Environment Variables (.env):
 *  - PORT: Server port (default: 5000)
 *  - MONGO_URI: MongoDB connection string
 *  - JWT_SECRET: JWT signing secret
 *  - GEMINI_API_KEY: Google Gemini API key
 */

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');

// ── Load environment variables ───────────────────────
dotenv.config({ path: './.env.local' });

const connectDB = require('./config/db.js');

// ── Import routes ────────────────────────────────────
const authRoutes = require('./routes/authRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');

// ── Initialize Express app ───────────────────────────
const app = express();

// ── Middleware ───────────────────────────────────────
app.use(cors());                    // Enable CORS
app.use(express.json());           // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ── Connect to MongoDB ───────────────────────────────
connectDB();

// ── Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes);   // Authentication routes
app.use('/api/chat', chatRoutes);   // Chat routes

// ── Health check endpoint ────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Health Chatbot API is running',
    timestamp: new Date().toISOString()
  });
});

// ── 404 handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// ── Start server ─────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`💬 Chat routes: http://localhost:${PORT}/api/chat`);
});