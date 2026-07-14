/**
 * src/main.jsx — React Entry Point
 * ──────────────────────────────────
 * Mounts the React app into <div id="root"> in index.html.
 * Wraps everything in BrowserRouter for client-side routing.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)