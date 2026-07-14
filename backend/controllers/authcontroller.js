/**
 * controllers/authController.js — Auth Logic
 * ────────────────────────────────────────────
 * register(): Creates a new user in MongoDB
 * login()   : Verifies credentials, returns JWT
 * getMe()   : Returns current user profile (protected route)
 *
 * Flow:
 *  POST /api/auth/register → register()
 *  POST /api/auth/login    → login()
 *  GET  /api/auth/me       → getMe()  [requires JWT]
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: generate JWT ─────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // Token valid for 7 days
  );
};

// ── Register ─────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user (password hashed via pre-save hook in User.js)
    const user = await User.create({ name, email, password });

    // Return user info + token
    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ── Login ────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password using bcrypt (defined in User model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ── Get current user (protected) ─────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware.js
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe };