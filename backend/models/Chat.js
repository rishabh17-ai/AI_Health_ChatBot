/**
 * models/Chat.js — Chat History Schema
 * ──────────────────────────────────────
 * Each document represents one conversation session for a user.
 *
 * Structure:
 *  - user     : Reference to User._id (who owns this chat)
 *  - title    : Auto-generated from first message
 *  - messages : Array of { role, content, timestamp }
 *               role is either "user" or "assistant"
 *
 * This design stores full conversation history per session,
 * which is also passed to Gemini for context-aware replies.
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'New Conversation'
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);