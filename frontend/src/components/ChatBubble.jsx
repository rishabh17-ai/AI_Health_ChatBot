/**
 * src/components/ChatBubble.jsx — Individual Message Bubble
 * ───────────────────────────────────────────────────────────
 * Renders a single chat message.
 *
 * Props:
 *  - role     : "user" | "assistant"
 *  - content  : message text
 *  - timestamp: JS Date or ISO string
 *
 * Features:
 *  - Different styling for user vs assistant
 *  - Renders simple markdown (bold, lists) in assistant replies
 *  - Fade-slide-in animation on mount
 */

import { useMemo } from 'react'

// Very lightweight markdown renderer (no external lib needed)
const renderMarkdown = (text) => {
  let html = text
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Bullet list items: lines starting with - or *
    .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
    // Numbered list
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraph breaks
    .replace(/\n\n/g, '</p><p>')

  return `<p>${html}</p>`
}

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatBubble({ role, content, timestamp }) {
  const isUser = role === 'user'
  const htmlContent = useMemo(() => renderMarkdown(content), [content])

  return (
    <div className={`flex gap-3 chat-bubble-animate ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-medium
        ${isUser
          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/20'
          : 'bg-blue-500/10 text-blue-300 border border-blue-500/15'
        }`}>
        {isUser ? '👤' : '🏥'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-teal-500/15 border border-teal-500/20 text-teal-50 rounded-tr-sm'
            : 'bg-[#132338] border border-[#1e3a5f] text-slate-200 rounded-tl-sm prose-chat'
          }`}
        >
          {isUser
            ? <p>{content}</p>
            : <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          }
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[11px] text-slate-600 px-1">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  )
}