/**
 * src/pages/Chat.jsx — Main Chat Interface
 * ──────────────────────────────────────────
 * This is the heart of the frontend. It manages:
 *
 * State:
 *  - messages      : current conversation messages array
 *  - input         : controlled textarea value
 *  - isTyping      : show typing indicator while waiting for AI
 *  - chatId        : current MongoDB chat session ID (null = new)
 *  - chatHistory   : list of past sessions (sidebar)
 *  - sidebarOpen   : mobile sidebar toggle
 *
 * Flow when user sends a message:
 *  1. Optimistically add user message to UI
 *  2. POST /api/chat/send with { message, chatId }
 *  3. Show typing indicator
 *  4. Receive AI reply → add to messages, hide indicator
 *  5. Update chatId (for new chats) and refresh sidebar
 *
 * Flow on load:
 *  GET /api/chat/history → populate sidebar
 *
 * Flow when clicking a sidebar item:
 *  GET /api/chat/:chatId → load full conversation
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import api            from '../api/axios'
import { useAuth }    from '../context/AuthContext'
import Navbar         from '../components/navbar'
import ChatBubble     from '../components/ChatBubble'
import TypingIndicator from '../components/TypingIndicator'

// ── Suggested quick-start prompts ────────────────────
const SUGGESTIONS = [
  { icon: '💊', text: 'What are common cold remedies?' },
  { icon: '🧠', text: 'Tips to manage anxiety and stress' },
  { icon: '🏃', text: 'Best exercises for beginners' },
  { icon: '😴', text: 'How to improve sleep quality?' },
  { icon: '🥗', text: 'Guide to a balanced diet' },
  { icon: '❤️',  text: 'Warning signs of high blood pressure' },
]

export default function Chat() {
  const { user }    = useAuth()
  const bottomRef   = useRef(null)  // for auto-scroll
  const inputRef    = useRef(null)  // for auto-focus

  const [messages,     setMessages]     = useState([])
  const [input,        setInput]        = useState('')
  const [isTyping,     setIsTyping]     = useState(false)
  const [chatId,       setChatId]       = useState(null)
  const [chatHistory,  setChatHistory]  = useState([])
  const [histLoading,  setHistLoading]  = useState(true)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [sendError,    setSendError]    = useState('')

  // ── Load chat history sidebar on mount ──────────────
  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await api.get('/api/chat/history')
      setChatHistory(data)
    } catch (err) {
      console.error('History fetch failed:', err)
    } finally {
      setHistLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  // ── Auto-scroll to bottom when messages change ───────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── Load a past conversation ─────────────────────────
  const loadChat = async (id) => {
    try {
      const { data } = await api.get(`/api/chat/${id}`)
      setChatId(data._id)
      setMessages(data.messages)
      setSidebarOpen(false)
      setSendError('')
    } catch (err) {
      console.error('Load chat failed:', err)
    }
  }

  // ── Start a fresh conversation ───────────────────────
  const newChat = () => {
    setChatId(null)
    setMessages([])
    setInput('')
    setSendError('')
    setSidebarOpen(false)
    inputRef.current?.focus()
  }

  // ── Send a message ────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isTyping) return

    setSendError('')
    setInput('')

    // 1. Optimistically show user message in UI
    const userMsg = { role: 'user', content: trimmed, createdAt: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      // 2. POST to backend → Gemini API
      const { data } = await api.post('/api/chat/send', {
        message: trimmed,
        chatId:  chatId   // null for first message (creates new session)
      })

      // 3. Update chatId (important for continuing the conversation)
      if (!chatId) {
        setChatId(data.chatId)
        // Refresh sidebar to show new chat session
        fetchHistory()
      }

      // 4. Add AI response to messages
      const botMsg = {
        role: 'assistant',
        content: data.reply,
        createdAt: new Date()
      }
      setMessages(prev => [...prev, botMsg])

    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get a response. Please try again.'
      setSendError(errMsg)
      // Remove the optimistic user message on error
      setMessages(prev => prev.filter(m => m !== userMsg))
    } finally {
      setIsTyping(false)
    }
  }

  // ── Handle textarea keyboard events ─────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
    // Shift+Enter = newline (default textarea behavior)
  }

  // ── Delete a chat from sidebar ───────────────────────
  const deleteChat = async (e, id) => {
    e.stopPropagation() // Don't trigger loadChat
    try {
      await api.delete(`/api/chat/${id}`)
      setChatHistory(prev => prev.filter(c => c._id !== id))
      if (chatId === id) newChat()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="h-screen flex flex-col bg-[#0a1628] overflow-hidden">

      {/* ── Navbar ────────────────────────────────────── */}
      <Navbar
        onNewChat={newChat}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Sidebar ───────────────────────────────────── */}
        <>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-10"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside className={`
            w-64 flex-shrink-0 flex flex-col bg-[#0a1628] border-r border-[#1e3a5f]
            transition-transform duration-300 z-20
            fixed md:relative h-full
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            {/* New chat button */}
            <div className="p-3 border-b border-[#1e3a5f]">
              <button
                onClick={newChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                           bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/20
                           text-teal-400 text-sm font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New conversation
              </button>
            </div>

            {/* History list */}
            <div className="flex-1 overflow-y-auto p-2">
              {histLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                </div>
              ) : chatHistory.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-8 px-4">
                  No past conversations yet. Start chatting!
                </p>
              ) : (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider px-2 py-2 font-medium">
                    Recent
                  </p>
                  {chatHistory.map(chat => (
                    <div
                      key={chat._id}
                      onClick={() => loadChat(chat._id)}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
                                  hover:bg-white/5 transition-colors
                                  ${chatId === chat._id ? 'sidebar-item-active' : ''}`}
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs text-slate-300 truncate flex-1 leading-relaxed">
                        {chat.title}
                      </span>
                      {/* Delete button (visible on hover) */}
                      <button
                        onClick={(e) => deleteChat(e, chat._id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-600
                                   hover:text-red-400 transition-all flex-shrink-0"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User info footer */}
            <div className="p-3 border-t border-[#1e3a5f]">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20
                                flex items-center justify-center text-xs text-teal-400">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </aside>
        </>

        {/* ── Main chat area ───────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">

              {/* ── Welcome screen (empty state) ──────── */}
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/15
                                  flex items-center justify-center text-2xl mb-5">
                    🏥
                  </div>
                  <h2 className="font-display text-2xl text-white font-semibold mb-2">
                    Hello, {user?.name?.split(' ')[0]}!
                  </h2>
                  <p className="text-slate-400 text-sm max-w-sm mb-8">
                    I'm MediChat, your AI health companion. Ask me anything about health,
                    wellness, symptoms, or healthy living.
                  </p>

                  {/* Quick suggestion chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => sendMessage(s.text)}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-left
                                   bg-[#0f2040] hover:bg-[#132338] border border-[#1e3a5f]
                                   hover:border-teal-500/25 transition-all group"
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors leading-tight">
                          {s.text}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[11px] text-slate-600 mt-8 max-w-sm">
                    ⚠️ MediChat provides general health information only and is not a substitute
                    for professional medical advice.
                  </p>
                </div>
              ) : (
                /* ── Message list ─────────────────────── */
                <div className="space-y-5">
                  {messages.map((msg, i) => (
                    <ChatBubble
                      key={msg._id || `${msg.role}-${msg.createdAt}-${i}`}
                      role={msg.role}
                      content={msg.content}
                      timestamp={msg.createdAt}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
          </div>

          {/* ── Error banner ────────────────────────────── */}
          {sendError && (
            <div className="mb-2 max-w-2xl mx-auto px-4">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs
                              px-4 py-2.5 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sendError}
              </div>
            </div>
          )}

          {/* ── Input area ──────────────────────────────── */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end gap-2 bg-[#0f2040] border border-[#1e3a5f]
                              rounded-2xl px-4 py-3 focus-within:border-teal-500/40
                              transition-all duration-200">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about your health..."
                  rows={1}
                  style={{ resize: 'none', maxHeight: '120px' }}
                  className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm
                             outline-none leading-relaxed py-0.5
                             scrollbar-none overflow-y-auto"
                  onInput={(e) => {
                    // Auto-grow textarea
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                  }}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-teal-500 hover:bg-teal-400
                             disabled:opacity-30 disabled:cursor-not-allowed
                             flex items-center justify-center transition-all duration-200
                             active:scale-95"
                >
                  {isTyping ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-700 text-center mt-2">
                Press Enter to send · Shift+Enter for new line · Not a substitute for medical advice
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}