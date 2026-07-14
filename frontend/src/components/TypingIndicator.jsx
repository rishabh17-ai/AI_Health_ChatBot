/**
 * src/components/TypingIndicator.jsx — AI Typing Animation
 * ──────────────────────────────────────────────────────────
 * Shown while waiting for Gemini's response.
 * Three bouncing dots styled to match the assistant bubble.
 */

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 chat-bubble-animate">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                      bg-blue-500/10 text-blue-300 border border-blue-500/15 text-sm">
        🏥
      </div>

      {/* Dots bubble */}
      <div className="bg-[#132338] border border-[#1e3a5f] px-4 py-3.5 rounded-2xl rounded-tl-sm
                      flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 bg-teal-400/60 rounded-full block" />
        <span className="typing-dot w-2 h-2 bg-teal-400/60 rounded-full block" />
        <span className="typing-dot w-2 h-2 bg-teal-400/60 rounded-full block" />
      </div>
    </div>
  )
}