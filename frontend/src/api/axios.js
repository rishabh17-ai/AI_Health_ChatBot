/**
 * src/api/axios.js — Configured Axios Instance
 * ──────────────────────────────────────────────
 * Creates a pre-configured Axios instance with:
 *  - Base URL pointing to the Express backend
 *  - Request interceptor that automatically attaches
 *    the JWT token to every outgoing request header
 *  - Response interceptor that redirects to /login
 *    if the server returns 401 (token expired / invalid)
 *
 * Import this instead of plain axios everywhere in the app.
 */

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// ── Request interceptor: attach JWT ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medichat_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle auth errors ─────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.removeItem('medichat_token')
      localStorage.removeItem('medichat_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api