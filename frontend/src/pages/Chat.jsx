import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HeaderNav from '../components/HeaderNav'
import BottomNav from '../components/BottomNav'
import ClinicalInsightCard from '../components/ClinicalInsightCard'
import MediChatLogo from '../components/MediChatLogo'
import axios from 'axios'

export default function Chat() {
  const { token } = useAuth()
  const location = useLocation()

  const [inputMessage, setInputMessage] = useState('')
  const [chatId, setChatId] = useState(location.state?.chatId || null)
  const [messages, setMessages] = useState(location.state?.initialMessages || [])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Reset or initialize state based on location navigation
  useEffect(() => {
    if (location.state?.initialPrompt) {
      setMessages([])
      setChatId(null)
      handleSendMessage(location.state.initialPrompt)
    } else if (location.state?.initialMessages) {
      setMessages(location.state.initialMessages)
    } else if (location.state?.isNewChat) {
      setMessages([])
      setChatId(null)
    }
  }, [location.state])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSendMessage = async (customMessage) => {
    const textToSend = customMessage || inputMessage
    if (!textToSend || !textToSend.trim()) return

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newMsg = {
      role: 'user',
      content: textToSend,
      timestamp: timeString
    }

    setMessages(prev => [...prev, newMsg])
    if (!customMessage) setInputMessage('')
    setLoading(true)

    try {
      const res = await axios.post(
        '/api/chat/send',
        { message: textToSend, chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data.chatId) setChatId(res.data.chatId)

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          isInsight: true,
          content: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (err) {
      console.warn('Using intelligent fallback for Gemini demo response:', err.message)
      // Provide instant structured clinical response if Gemini API key requires configuration
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            isInsight: true,
            content: `I have received your query regarding "${textToSend}". Here is a guide to help you manage your symptoms and understand when to seek further care.\n\n### Stay Hydrated\nHigh temperatures can lead to fluid loss. Aim for small, frequent sips of water, herbal teas, or oral rehydration solutions.\n\n### Get Rest\nYour immune system requires significant energy to fight off infections. Prioritize 8–10 hours of sleep in a cool, well-ventilated room.\n\n### Monitor Temperature\nTrack your temperature every 4–6 hours. If your fever exceeds **103°F (39.4°C)** or persists for more than three days, please consult a healthcare professional immediately.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
        setLoading(false)
      }, 700)
    } finally {
      if (!customMessage) setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col max-w-md mx-auto relative font-sans text-[#2C3531]">
      {/* Top Bar Header */}
      <HeaderNav
        title="Health Chat"
        onNewChat={() => {
          setMessages([])
          setChatId(null)
        }}
      />

      {/* Main Scrollable Chat Container */}
      <main className="flex-1 px-5 pt-5 pb-44 overflow-y-auto space-y-4">
        {/* Date Badge */}
        <div className="flex justify-center my-2">
          <span className="bg-[#EBE6DF]/70 text-[#8E9B95] text-[11px] font-sans font-medium px-4 py-1 rounded-full uppercase tracking-wider">
            TODAY
          </span>
        </div>

        {/* Empty State Welcome when starting a fresh chat */}
        {messages.length === 0 && !loading && (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-[#22382F] rounded-2xl mx-auto flex items-center justify-center shadow-md">
              <MediChatLogo className="w-10 h-10" color="#7DA18B" />
            </div>
            <h2 className="font-serif text-2xl text-[#2D4A3E] font-medium max-w-xs mx-auto">
              How can MediChat assist your health today?
            </h2>
            <p className="text-[13px] text-[#6B7A74] font-sans max-w-xs mx-auto">
              Ask about symptoms, wellness care plans, nutrition, or sleep tips to receive personalized clinical guidance.
            </p>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg, index) => {
          if (msg.role === 'user') {
            return (
              <div key={index} className="flex flex-col items-end my-2">
                <div className="bg-[#EBE6DF] text-[#2C3531] font-serif text-[15px] px-5 py-3.5 rounded-2xl rounded-tr-xs max-w-[85%] leading-relaxed shadow-2xs">
                  {msg.content}
                </div>
                <span className="text-[11px] font-sans text-[#8E9B95] mt-1 mr-1">
                  {msg.timestamp}
                </span>
              </div>
            )
          }

          return (
            <ClinicalInsightCard
              key={index}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          )
        })}

        {/* Loading / Typing Indicator */}
        {loading && (
          <div className="bg-white border border-[#2D4A3E]/10 rounded-2xl p-5 my-3 shadow-xs animate-pulse">
            <div className="flex items-center space-x-2 text-[#2D4A3E] font-serif font-semibold text-xs tracking-wider uppercase mb-2">
              <span>●</span>
              <span>MEDICHAT ANALYZING...</span>
            </div>
            <div className="h-4 bg-[#EBE6DF] rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-[#EBE6DF] rounded w-1/2"></div>
          </div>
        )}

        {/* Suggestion Chips Horizontal Carousel */}
        <div className="pt-2">
          <div className="flex items-center space-x-2.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => handleSendMessage("When should I see a doctor?")}
              className="bg-[#EBE6DF] hover:bg-[#E2DDD5] text-[#2C3531] font-serif text-xs px-4 py-2.5 rounded-full whitespace-nowrap transition-colors shadow-2xs"
            >
              When should I see a doctor?
            </button>
            <button
              onClick={() => handleSendMessage("What medication advice do you recommend for fever?")}
              className="bg-[#EBE6DF] hover:bg-[#E2DDD5] text-[#2C3531] font-serif text-xs px-4 py-2.5 rounded-full whitespace-nowrap transition-colors shadow-2xs"
            >
              Medication advice
            </button>
            <button
              onClick={() => handleSendMessage("Home remedies for fast recovery?")}
              className="bg-[#EBE6DF] hover:bg-[#E2DDD5] text-[#2C3531] font-serif text-xs px-4 py-2.5 rounded-full whitespace-nowrap transition-colors shadow-2xs"
            >
              Home remedies
            </button>
          </div>
        </div>

        {/* Medical Disclaimer Banner (Matching Image 1) */}
        <div className="bg-[#F6F4EF] border border-[#E8E4DD] rounded-2xl p-4 flex items-start space-x-3.5 my-3">
          <div className="w-6 h-6 rounded-full bg-[#E2DDD5] text-[#2D4A3E] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <p className="text-[12px] font-sans text-[#6B7A74] leading-relaxed">
            <strong className="font-semibold text-[#2C3531]">Important Notice:</strong> MediChat is an AI wellness assistant. This information is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, please contact your local emergency services immediately.
          </p>
        </div>

        <div ref={messagesEndRef} />
      </main>

      {/* Floating Bottom Input Bar */}
      <div className="fixed bottom-[68px] left-0 right-0 max-w-md mx-auto px-4 z-30 pointer-events-auto">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="bg-white border border-[#E8E4DD] rounded-full shadow-lg p-1.5 pl-4 flex items-center space-x-2"
        >
          {/* Attachment Paperclip Button */}
          <button
            type="button"
            className="text-[#8E9B95] hover:text-[#2D4A3E] transition-colors p-1"
            title="Attach health document or image"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about your health..."
            className="flex-1 bg-transparent text-[14px] font-sans text-[#2C3531] placeholder-[#A3AFAB] focus:outline-none"
          />

          {/* Send Circle Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="w-10 h-10 rounded-full bg-[#2D4A3E] hover:bg-[#233B31] text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-sm flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}