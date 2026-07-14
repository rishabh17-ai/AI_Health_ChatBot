/**
 * src/components/Navbar.jsx — Top Navigation Bar
 * ─────────────────────────────────────────────────
 * Props:
 *  - onNewChat : callback to start a new conversation
 *  - onToggleSidebar : toggles mobile sidebar visibility
 *
 * Displays:
 *  - App logo/name
 *  - User's name
 *  - New chat button
 *  - Logout button
 */

import { useAuth } from '../context/AuthContext'

export default function Navbar({ onNewChat, onToggleSidebar }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-4 py-3
                       border-b border-[#1e3a5f] bg-[#0a1628]/80 backdrop-blur-sm
                       flex-shrink-0">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/20
                          flex items-center justify-center">
            <span className="text-sm">🏥</span>
          </div>
          <span className="font-display font-semibold text-white text-lg tracking-tight">
            Medi<span className="gradient-text">Chat</span>
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* New chat button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20
                     text-teal-400 text-sm font-medium transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New chat</span>
        </button>

        {/* User info + logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1e3a5f]">
          <span className="text-sm text-slate-400 hidden sm:inline">
            {user?.name}
          </span>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}