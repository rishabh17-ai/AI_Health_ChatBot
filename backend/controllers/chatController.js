/**
 * controllers/chatController.js — Chat Logic + Gemini API
 * ─────────────────────────────────────────────────────────
 * This is the core of the chatbot. It:
 *  1. Receives the user's message from the frontend
 *  2. Loads (or creates) a chat session in MongoDB
 *  3. Sends the full conversation history to Google Gemini API
 *  4. Saves Gemini's response back to MongoDB
 *  5. Returns the response to the frontend
 *
 * Routes handled:
 *  POST /api/chat/send          → sendMessage()
 *  GET  /api/chat/history       → getChatHistory()
 *  GET  /api/chat/:chatId       → getSingleChat()
 *  DELETE /api/chat/:chatId     → deleteChat()
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

// ── Initialize Gemini client ──────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── System prompt for the health chatbot ─────────────
const HEALTH_SYSTEM_PROMPT = `You are MediChat, a compassionate and knowledgeable AI health assistant.

Your role is to:
- Provide general health information and wellness advice
- Help users understand medical terminology and conditions
- Suggest when to seek professional medical care
- Offer mental health support and stress management tips
- Guide healthy lifestyle choices (diet, exercise, sleep)

Important guidelines:
- ALWAYS remind users that you are an AI and cannot replace a licensed medical professional
- For emergencies, always direct users to call emergency services (112 in India, 911 in US)
- Never diagnose specific medical conditions
- Be empathetic, clear, and supportive
- Respond in the same language the user uses
- Keep responses concise but thorough (aim for 150-300 words unless more detail is needed)`;

// ── Send message & get AI response ───────────────────
const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    let chat;

    // ── Load existing chat OR create new one ──────────
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: userId });
      if (!chat) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
    } else {
      // New conversation — title is first 50 chars of first message
      chat = await Chat.create({
        user: userId,
        title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // ── Append user message to MongoDB ────────────────
    chat.messages.push({ role: 'user', content: message });

    // ── Build Gemini-format message history ───────────
    // Gemini uses 'user' and 'model' roles (not 'assistant')
    const geminiHistory = chat.messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // ── Call Google Gemini API ────────────────────────
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: HEALTH_SYSTEM_PROMPT
    });

    const chatSession = model.startChat({ history: geminiHistory });
    const result = await chatSession.sendMessage(message);
    const assistantReply = result.response.text();

    // ── Save Gemini's reply to MongoDB ────────────────
    chat.messages.push({ role: 'assistant', content: assistantReply });
    await chat.save();

    // ── Return response to frontend ───────────────────
    res.json({
      chatId: chat._id,
      reply: assistantReply,
      title: chat.title
    });

  } catch (error) {
    console.error('Chat error:', error);

    // Handle Gemini API errors
    if (error.status === 400) {
      return res.status(400).json({ message: 'Invalid request to AI service.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ message: 'AI service rate limit reached. Please wait a moment.' });
    }
    if (error.message && error.message.includes('API_KEY')) {
      return res.status(500).json({ message: 'Invalid Gemini API key. Check your .env.local file.' });
    }

    res.status(500).json({ message: 'Error processing your message' });
  }
};

// ── Get all chat sessions for a user ─────────────────
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .select('title createdAt updatedAt') // Don't load all messages for list view
      .sort({ updatedAt: -1 }); // Most recent first

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

// ── Get a single full chat session ───────────────────
const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
};

// ── Delete a chat session ─────────────────────────────
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      user: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat' });
  }
};

module.exports = { sendMessage, getChatHistory, getSingleChat, deleteChat };