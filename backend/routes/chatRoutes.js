/**
 * routes/chatRoutes.js — Chat Routes
 * ────────────────────────────────────
 * Mounted at: /api/chat
 * ALL routes are protected (require JWT)
 *
 * POST   /api/chat/send         → Send message, get AI reply
 * GET    /api/chat/history      → Get all chat sessions
 * GET    /api/chat/:chatId      → Get one full chat
 * DELETE /api/chat/:chatId      → Delete a chat session
 */

const express  = require('express');
const router   = express.Router();
const {
  sendMessage,
  getChatHistory,
  getSingleChat,
  deleteChat
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(protect);

router.post('/send',          sendMessage);
router.get('/history',        getChatHistory);
router.get('/:chatId',        getSingleChat);
router.delete('/:chatId',     deleteChat);

module.exports = router;