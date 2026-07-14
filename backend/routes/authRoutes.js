/**
 * routes/authRoutes.js — Authentication Routes
 * ──────────────────────────────────────────────
 * Mounted at: /api/auth
 *
 * POST /api/auth/register  → Create new user account
 * POST /api/auth/login     → Login + receive JWT
 * GET  /api/auth/me        → Get current user (protected)
 */

const express  = require('express');
const router   = express.Router();
const { register, login, getMe } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);  // ← JWT required

module.exports = router;