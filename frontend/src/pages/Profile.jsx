import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HeaderNav from '../components/HeaderNav'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 max-w-md mx-auto relative font-sans text-[#2C3531]">
      <HeaderNav title="User Profile" showBack onBack={() => navigate(-1)} />

      <main className="px-5 pt-4 space-y-6">
        {/* User Badge */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DD] flex flex-col items-center text-center shadow-xs">
          <div className="w-20 h-20 rounded-full border-4 border-[#EBE6DF] overflow-hidden mb-3 bg-[#2D4A3E] flex items-center justify-center text-white text-2xl font-serif">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h2 className="font-serif text-2xl text-[#2C3531] font-medium">
            {user?.name || 'Alex Smith'}
          </h2>
          <p className="text-[13px] text-[#6B7A74] font-sans mt-0.5">
            {user?.email || 'alex@example.com'}
          </p>

          <span className="mt-3 bg-[#D1E7DD] text-[#2D4A3E] text-xs font-semibold px-3 py-1 rounded-full">
            MediChat Premium Member
          </span>
        </div>

        {/* Options List */}
        <div className="bg-white rounded-3xl p-2 border border-[#E8E4DD] divide-y divide-[#E8E4DD]/50 shadow-2xs">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] rounded-2xl transition-colors">
            <div className="flex items-center space-x-3 text-[#2C3531]">
              <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="font-sans text-[14px] font-medium">Personal Information</span>
            </div>
            <svg className="w-4 h-4 text-[#8E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>

          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] rounded-2xl transition-colors">
            <div className="flex items-center space-x-3 text-[#2C3531]">
              <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="font-sans text-[14px] font-medium">Privacy & Security</span>
            </div>
            <svg className="w-4 h-4 text-[#8E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>

          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] rounded-2xl transition-colors">
            <div className="flex items-center space-x-3 text-[#2C3531]">
              <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="font-sans text-[14px] font-medium">Notifications</span>
            </div>
            <svg className="w-4 h-4 text-[#8E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-[#FDF2F2] hover:bg-[#FCE8E8] text-[#A03E24] font-medium py-4 rounded-full transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>Sign Out</span>
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
