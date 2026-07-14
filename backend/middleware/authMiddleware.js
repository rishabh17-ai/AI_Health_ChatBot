/**
 * middleware/authMiddleware.js — JWT Protection
 * ──────────────────────────────────────────────
 * This middleware runs BEFORE protected route handlers.
 * It reads the "Authorization: Bearer <token>" header,
 * verifies the JWT, and attaches the user to req.user.
 *
 * Usage: Add `protect` to any route that requires login.
 * Example: router.get('/me', protect, getMe)
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // ── Extract token from Authorization header ────────
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    // ── Verify token signature + expiry ───────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── Attach user to request (excluding password) ───
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next(); // ✅ Proceed to the actual route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired — please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };