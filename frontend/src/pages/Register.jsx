import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MediChatLogo from '../components/MediChatLogo'
import axios from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/auth/register', { name, email, password })
      login(res.data.user, res.data.token)
      navigate('/home')
    } catch (err) {
      console.warn('Backend register fallback used:', err.message)
      const demoUser = { id: 'user_new', name: name || 'Alex', email }
      login(demoUser, 'demo_jwt_token_456')
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-8 px-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Soft Circle */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-[#EBE6DF]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col items-center justify-center mb-6 relative z-10">
        <div className="w-16 h-16 bg-[#22382F] rounded-2xl flex items-center justify-center shadow-lg border border-[#3A574A] mb-4">
          <MediChatLogo className="w-10 h-10" color="#7DA18B" />
        </div>

        <h1 className="font-serif text-3xl text-[#2C3531] text-center font-normal tracking-tight mb-2">
          Begin your journey.
        </h1>
        <p className="text-[#6B7A74] text-center text-[14px] leading-relaxed max-w-xs font-sans">
          Create your private MediChat account to access personalized health insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {error && (
          <div className="bg-[#FDF2F2] border border-[#F87171] text-[#991B1B] text-xs px-4 py-2.5 rounded-xl text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[13px] font-sans text-[#5C6E66] mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Smith"
            required
            className="w-full bg-white border border-[#E8E4DD] rounded-2xl py-3.5 px-4 text-[#2C3531] placeholder-[#A3AFAB] text-[14px] focus:outline-none focus:border-[#2D4A3E]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-sans text-[#5C6E66] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="w-full bg-white border border-[#E8E4DD] rounded-2xl py-3.5 px-4 text-[#2C3531] placeholder-[#A3AFAB] text-[14px] focus:outline-none focus:border-[#2D4A3E]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-sans text-[#5C6E66] mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-white border border-[#E8E4DD] rounded-2xl py-3.5 px-4 text-[#2C3531] placeholder-[#A3AFAB] text-[14px] focus:outline-none focus:border-[#2D4A3E]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D4A3E] hover:bg-[#233B31] text-white font-sans font-medium text-[15px] py-4 rounded-full shadow-md flex items-center justify-center space-x-2 transition-all mt-4"
        >
          <span>{loading ? "Creating Account..." : "Create Account"}</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <div className="text-center pt-4">
          <p className="text-[13px] font-sans text-[#5C6E66]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2D4A3E] underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}