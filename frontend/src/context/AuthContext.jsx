/**
 * src/context/AuthContext.jsx — Global Auth State
 * ──────────────────────────────────────────────────
 * React Context that makes auth state available to every
 * component in the tree without prop-drilling.
 *
 * Provides:
 *  - user        : current user object (or null)
 *  - token       : JWT string (or null)
 *  - loading     : true while checking localStorage on mount
 *  - login()     : saves token+user to state & localStorage
 *  - logout()    : clears state & localStorage, redirects
 *  - isAuth      : boolean shorthand for !!user
 *
 * Usage in any component:
 *   import { useAuth } from '../context/AuthContext'
 *   const { user, logout } = useAuth()
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // ── Restore session from localStorage on app load ───
  useEffect(() => {
    const savedToken = localStorage.getItem('medichat_token')
    const savedUser  = localStorage.getItem('medichat_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // ── Called after successful login/register ───────────
  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('medichat_token', jwtToken)
    localStorage.setItem('medichat_user',  JSON.stringify(userData))
  }

  // ── Called on logout button click ────────────────────
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('medichat_token')
    localStorage.removeItem('medichat_user')
    navigate('/login')
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuth: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy consumption
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}