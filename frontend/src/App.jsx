/**
 * src/App.jsx — Root Component & Route Definitions
 * ──────────────────────────────────────────────────
 * Sets up React Router routes and wraps the app in AuthProvider.
 *
 * Route structure:
 *  /           → redirects to /chat if logged in, else /login
 *  /login      → Login page
 *  /register   → Register page
 *  /chat       → Main chat UI (protected)
 *
 * PrivateRoute: redirects unauthenticated users to /login.
 * PublicRoute:  redirects already-logged-in users to /chat.
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth }    from './context/AuthContext'
import Login    from './pages/Login'
import Register from './pages/Register'
import Chat     from './pages/Chat'

// ── Protected route — requires login ─────────────────
const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0a1628]">
    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
  </div>
  return isAuth ? children : <Navigate to="/login" replace />
}

// ── Public route — redirect if already logged in ──────
const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  if (loading) return null
  return !isAuth ? children : <Navigate to="/chat" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />

      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      <Route path="/chat" element={
        <PrivateRoute><Chat /></PrivateRoute>
      } />

      {/* Catch-all → redirect home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}