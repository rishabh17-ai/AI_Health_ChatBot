import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Chat from './pages/Chat'
import History from './pages/History'
import Profile from './pages/Profile'

// ── Protected route — requires login ─────────────────
const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF8F5]">
        <div className="w-8 h-8 border-2 border-[#2D4A3E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return isAuth ? children : <Navigate to="/login" replace />
}

// ── Public route — redirect if already logged in ──────
const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  if (loading) return null
  return !isAuth ? children : <Navigate to="/home" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      <Route path="/home" element={
        <PrivateRoute><Home /></PrivateRoute>
      } />

      <Route path="/chat" element={
        <PrivateRoute><Chat /></PrivateRoute>
      } />

      <Route path="/history" element={
        <PrivateRoute><History /></PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute><Profile /></PrivateRoute>
      } />

      {/* Catch-all → redirect home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
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