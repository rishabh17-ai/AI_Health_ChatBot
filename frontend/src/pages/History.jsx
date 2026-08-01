import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderNav from '../components/HeaderNav'
import BottomNav from '../components/BottomNav'

export default function History() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All Chats')
  const [searchQuery, setSearchQuery] = useState('')

  const historyItems = [
    {
      id: '1',
      title: 'Cold & Fever Care',
      time: '2h ago',
      preview: 'Discussed hydration strategies and temperature monitoring...',
      category: 'Symptoms',
      iconBg: 'bg-[#D1E7DD]',
      iconColor: 'text-[#2D4A3E]',
      section: 'RECENT',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      )
    },
    {
      id: '2',
      title: 'Sleep Quality Tips',
      time: 'Yesterday',
      preview: 'Adjusting evening routines to improve deep sleep cycles...',
      category: 'Care Plans',
      iconBg: 'bg-[#EBE6DF]',
      iconColor: 'text-[#5C6E66]',
      section: 'RECENT',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )
    },
    {
      id: '3',
      title: 'Daily Protein Intake',
      time: 'Oct 12',
      preview: 'Calculation based on your body weight and daily activity level...',
      category: 'Nutrition',
      iconBg: 'bg-[#FDE2D6]',
      iconColor: 'text-[#803525]',
      section: 'LAST WEEK',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      )
    },
    {
      id: '4',
      title: 'Mindful Walking',
      time: 'Oct 10',
      preview: 'Exploring low-impact cardiovascular routines for morning energy...',
      category: 'Care Plans',
      iconBg: 'bg-[#C8E4D8]',
      iconColor: 'text-[#2D4A3E]',
      section: 'LAST WEEK',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    }
  ]

  const filterCategories = ['All Chats', 'Care Plans', 'Symptoms', 'Nutrition']

  const filteredItems = historyItems.filter(item => {
    const matchesFilter = activeFilter === 'All Chats' || item.category === activeFilter
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.preview.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const recentItems = filteredItems.filter(item => item.section === 'RECENT')
  const lastWeekItems = filteredItems.filter(item => item.section === 'LAST WEEK')

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 max-w-md mx-auto relative font-sans text-[#2C3531]">
      {/* Header */}
      <HeaderNav title="Conversation Detail" showBack onBack={() => navigate(-1)} />

      <main className="px-5 pt-3 space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E9B95]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your health history..."
            className="w-full bg-white border border-[#E8E4DD] rounded-2xl py-3.5 pl-11 pr-4 text-[14px] text-[#2C3531] placeholder-[#A3AFAB] focus:outline-none focus:border-[#2D4A3E] shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto scrollbar-none py-1">
          {filterCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`font-sans text-xs px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-[#2D4A3E] text-white font-medium shadow-2xs'
                  : 'bg-[#EBE6DF] text-[#2C3531] font-normal hover:bg-[#E2DDD5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RECENT Section */}
        {recentItems.length > 0 && (
          <div>
            <h3 className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8E9B95] mb-2.5">
              RECENT
            </h3>
            <div className="space-y-3">
              {recentItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate('/chat', { state: { initialPrompt: item.title } })}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#E8E4DD]/60 shadow-2xs hover:shadow-xs cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3.5 overflow-hidden pr-2">
                    <div className={`w-11 h-11 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-medium text-[16px] text-[#2C3531] truncate">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[12px] font-sans text-[#6B7A74] truncate mt-0.5">
                        {item.preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    <span className="text-[11px] font-sans text-[#8E9B95]">
                      {item.time}
                    </span>
                    <svg className="w-4 h-4 text-[#8E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LAST WEEK Section */}
        {lastWeekItems.length > 0 && (
          <div className="pt-2">
            <h3 className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8E9B95] mb-2.5">
              LAST WEEK
            </h3>
            <div className="space-y-3">
              {lastWeekItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate('/chat', { state: { initialPrompt: item.title } })}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#E8E4DD]/60 shadow-2xs hover:shadow-xs cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3.5 overflow-hidden pr-2">
                    <div className={`w-11 h-11 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-serif font-medium text-[16px] text-[#2C3531] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[12px] font-sans text-[#6B7A74] truncate mt-0.5">
                        {item.preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    <span className="text-[11px] font-sans text-[#8E9B95]">
                      {item.time}
                    </span>
                    <svg className="w-4 h-4 text-[#8E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) matching Image 5 */}
      <button
        onClick={() => navigate('/chat', { state: { isNewChat: true } })}
        className="fixed bottom-20 right-6 z-30 w-14 h-14 rounded-full bg-[#2D4A3E] text-white shadow-xl flex items-center justify-center hover:bg-[#233B31] transition-transform active:scale-95"
        title="Start new health chat"
      >
        <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
