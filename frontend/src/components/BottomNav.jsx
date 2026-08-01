import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/home',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'stroke-[#2D4A3E]' : 'stroke-[#8E9B95]'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      id: 'chat',
      label: 'Chat',
      path: '/chat',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'stroke-[#2D4A3E]' : 'stroke-[#8E9B95]'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      )
    },
    {
      id: 'insights',
      label: 'Insights',
      path: '/history',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'stroke-[#2D4A3E]' : 'stroke-[#8E9B95]'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-3m0 0l-2.25 4.5M12 13.5l1.5-3 2.25 4.5" />
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/profile',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'stroke-[#2D4A3E]' : 'stroke-[#8E9B95]'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-t border-[#E8E4DD] max-w-md mx-auto py-2.5 px-6 flex items-center justify-between">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/chat' && location.pathname === '/')
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center space-y-1 group transition-all"
          >
            {item.icon(isActive)}
            <span className={`text-[11px] font-sans transition-colors ${
              isActive ? 'font-semibold text-[#2D4A3E]' : 'font-normal text-[#8E9B95]'
            }`}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
