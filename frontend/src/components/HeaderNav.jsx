import React from 'react'
import MediChatLogo from './MediChatLogo'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function HeaderNav({ title = "Health Chat", showBack = false, onBack, onNewChat }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-[#E8E4DD]/70 max-w-md mx-auto w-full">
      {/* Left: Logo / Back + Title */}
      <div className="flex items-center space-x-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-[#EBE6DF] transition-colors text-[#2D4A3E]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-[#22382F] flex items-center justify-center shadow-xs flex-shrink-0">
            <MediChatLogo className="w-6 h-6" color="#7DA18B" />
          </div>
        )}

        <h1 className="font-serif text-2xl tracking-tight text-[#2D4A3E] font-medium leading-none">
          {title}
        </h1>
      </div>

      {/* Right Controls: New Chat + User Profile */}
      <div className="flex items-center space-x-2">
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="flex items-center space-x-1 bg-[#2D4A3E] hover:bg-[#233B31] text-white text-xs font-sans font-medium px-3 py-2 rounded-full shadow-2xs transition-all active:scale-95"
            title="Start a new chat"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Chat</span>
          </button>
        )}

        <div
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full border-2 border-[#E8E4DD] overflow-hidden bg-[#EBE6DF] flex items-center justify-center cursor-pointer shadow-xs flex-shrink-0 hover:border-[#2D4A3E] transition-all"
          title="View Profile"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="User Profile" className="w-full h-full object-cover" />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </header>
  )
}
