import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HeaderNav from '../components/HeaderNav'
import BottomNav from '../components/BottomNav'
import MediChatLogo from '../components/MediChatLogo'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const userName = user?.name ? user.name.split(' ')[0] : 'Alex'

  const handleAskPrompt = (query) => {
    navigate('/chat', { state: { initialPrompt: query } })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 max-w-md mx-auto relative font-sans text-[#2C3531]">
      {/* Top Header */}
      <HeaderNav title="Medichat" />

      <main className="px-5 pt-4 space-y-6">
        {/* Welcome Banner */}
        <div>
          <h2 className="font-serif text-3xl font-normal tracking-tight text-[#2D4A3E]">
            Hello, {userName}
          </h2>
          <p className="text-[14px] text-[#6B7A74] mt-1 font-sans">
            Your wellness journey feels lighter today.
          </p>
        </div>

        {/* Feature Hero Card ("TODAY'S FOCUS") */}
        <div className="bg-[#3D6356] text-white rounded-3xl p-6 relative overflow-hidden shadow-sm">
          {/* Subtle Watermark Logo */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
            <MediChatLogo className="w-48 h-48" color="#FFFFFF" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-sans text-[#A8C7B9] tracking-wider uppercase">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>TODAY'S FOCUS</span>
            </div>

            <h3 className="font-serif text-2xl font-normal leading-snug max-w-[220px]">
              3 gentle ways to manage afternoon anxiety
            </h3>

            <button
              onClick={() => handleAskPrompt("Can you give me 3 gentle ways to manage afternoon anxiety?")}
              className="inline-flex items-center space-x-2 bg-white text-[#2D4A3E] font-sans font-medium text-xs py-2.5 px-5 rounded-full hover:bg-[#FAF8F5] transition-all shadow-sm"
            >
              <span>Read Guide</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Section: Explore Topics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans font-semibold text-[15px] text-[#2C3531]">
              Explore Topics
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-[#5C6E66] underline underline-offset-2 hover:text-[#2D4A3E]"
            >
              View All
            </button>
          </div>

          {/* Topics Carousel / Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Mental Health */}
            <div
              onClick={() => handleAskPrompt("Tell me about mental health wellness strategies")}
              className="bg-[#EBE6DF] p-4 rounded-2xl flex flex-col justify-between h-36 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
                </svg>
              </div>
              <span className="font-serif font-medium text-[14px] text-[#2C3531] leading-tight">
                Mental Health
              </span>
            </div>

            {/* Gut Health */}
            <div
              onClick={() => handleAskPrompt("How to improve my gut health naturally?")}
              className="bg-[#FDE2D6] p-4 rounded-2xl flex flex-col justify-between h-36 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5 text-[#803525]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                </svg>
              </div>
              <span className="font-serif font-medium text-[14px] text-[#803525] leading-tight">
                Gut Health
              </span>
            </div>

            {/* Sleep */}
            <div
              onClick={() => handleAskPrompt("What are the best tips for restful sleep?")}
              className="bg-[#D1E7DD] p-4 rounded-2xl flex flex-col justify-between h-36 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              </div>
              <span className="font-serif font-medium text-[14px] text-[#2D4A3E] leading-tight">
                Sleep
              </span>
            </div>
          </div>
        </div>

        {/* Section: Weekly Mood Balance */}
        <div className="bg-[#F4F0EA] rounded-3xl p-5 border border-[#E8E4DD]/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-sans text-[#8E9B95] tracking-wide">
              Weekly Mood Balance
            </span>
            <div className="w-7 h-7 rounded-full bg-[#E2ECE7] flex items-center justify-center text-[#2D4A3E]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
              </svg>
            </div>
          </div>

          <h4 className="font-serif text-2xl text-[#2D4A3E] font-normal mb-6">
            Steady & Calm
          </h4>

          {/* Bar Chart Representation */}
          <div className="flex items-end justify-between space-x-2 h-16 pt-2 px-2">
            <div className="w-full bg-[#D4DDD8] h-[55%] rounded-full"></div>
            <div className="w-full bg-[#D4DDD8] h-[70%] rounded-full"></div>
            <div className="w-full bg-[#D4DDD8] h-[40%] rounded-full"></div>
            <div className="w-full bg-[#D4DDD8] h-[85%] rounded-full"></div>
            <div className="w-full bg-[#D4DDD8] h-[75%] rounded-full"></div>
            <div className="w-full bg-[#D4DDD8] h-[90%] rounded-full"></div>
            <div className="w-full bg-[#2D4A3E] h-[100%] rounded-full"></div>
          </div>
        </div>

        {/* Ask Prompt Card */}
        <div
          onClick={() => handleAskPrompt("How can I improve my sleep tonight?")}
          className="bg-[#F4F0EA] rounded-2xl p-4 flex items-center space-x-3.5 border border-[#E8E4DD]/60 cursor-pointer hover:bg-[#EBE6DF] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2D4A3E] shadow-xs flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>

          <div className="flex-1">
            <p className="font-serif text-[15px] text-[#2C3531]">
              "How can I improve my sleep tonight?"
            </p>
            <span className="text-[12px] font-sans font-semibold text-[#2D4A3E]">
              Ask MediChat →
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
