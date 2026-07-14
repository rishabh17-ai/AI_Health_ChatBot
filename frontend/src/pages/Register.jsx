/**
 * src/pages/Register.jsx — Registration Page
 * ─────────────────────────────────────────────
 * - Controlled form with name, email, password, confirm-password
 * - Client-side password match validation
 * - Calls POST /api/auth/register via Axios
 * - On success: stores token via AuthContext.login()
 *               navigates to /chat
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password
      })
      login(data.user, data.token)
      navigate('/chat')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] px-4 py-10">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-700/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-4">
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-white font-semibold tracking-tight">
            Join Medi<span className="gradient-text">Chat</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Start your health journey today</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f2040] border border-[#1e3a5f] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Jane Doe"
                required
                className="w-full bg-[#0a1628] border border-[#1e3a5f] text-white placeholder-slate-600
                           rounded-xl px-4 py-3 text-sm input-glow transition-all duration-200
                           focus:border-teal-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0a1628] border border-[#1e3a5f] text-white placeholder-slate-600
                           rounded-xl px-4 py-3 text-sm input-glow transition-all duration-200
                           focus:border-teal-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full bg-[#0a1628] border border-[#1e3a5f] text-white placeholder-slate-600
                           rounded-xl px-4 py-3 text-sm input-glow transition-all duration-200
                           focus:border-teal-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                className="w-full bg-[#0a1628] border border-[#1e3a5f] text-white placeholder-slate-600
                           rounded-xl px-4 py-3 text-sm input-glow transition-all duration-200
                           focus:border-teal-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-medium py-3 rounded-xl transition-all duration-200
                         flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}