import React from 'react'

export default function ClinicalInsightCard({ content, timestamp = "10:25 AM" }) {
  // Parse structured sections if available or render formatted text
  return (
    <div className="my-4 animate-fade-in">
      <div className="bg-white border border-[#2D4A3E]/10 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Card Top Title */}
        <div className="flex items-center space-x-2 text-[#2D4A3E] font-serif font-bold tracking-wider text-sm uppercase mb-4">
          <span className="text-xs">●</span>
          <span>MEDICHAT CLINICAL INSIGHT</span>
        </div>

        {/* Dynamic formatted message body */}
        <div className="font-serif text-[#3A4742] text-[15px] leading-relaxed space-y-4">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: formatClinicalContent(content) }} />
          ) : (
            <>
              <p>
                I'm sorry to hear you're not feeling well. A fever is usually your body's natural response to an underlying infection. Here is a guide to help you manage your symptoms and understand when to seek further care.
              </p>

              <div>
                <h3 className="font-serif italic text-lg font-medium text-[#2D4A3E] mb-1">Stay Hydrated</h3>
                <p>
                  High temperatures can lead to fluid loss. Aim for small, frequent sips of water, herbal teas, or oral rehydration solutions. Avoid caffeine or sugary sodas which may cause further dehydration.
                </p>
              </div>

              <div>
                <h3 className="font-serif italic text-lg font-medium text-[#2D4A3E] mb-1">Get Rest</h3>
                <p>
                  Your immune system requires significant energy to fight off whatever is causing the fever. Avoid strenuous activity and prioritize 8–10 hours of sleep in a cool, well-ventilated room.
                </p>
              </div>

              <div>
                <h3 className="font-serif italic text-lg font-medium text-[#2D4A3E] mb-1">Monitor Temperature</h3>
                <p>
                  Track your temperature every 4–6 hours. If your fever exceeds <strong className="text-[#A03E24] font-semibold">103°F (39.4°C)</strong> or persists for more than three days, please consult a healthcare professional immediately.
                </p>
              </div>
            </>
          )}

          {/* Recovery Trajectory Widget */}
          <div className="pt-5 border-t border-[#E8E4DD] mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-sm text-[#5C6E66] font-medium">Recovery Trajectory</span>
              <span className="bg-[#D1E7DD] text-[#2D4A3E] text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full">
                Typical Pattern
              </span>
            </div>

            {/* Smooth SVG Wave Line Chart */}
            <div className="w-full h-12 pt-2">
              <svg viewBox="0 0 300 40" className="w-full h-full stroke-[#5C8266] fill-none">
                <path
                  d="M0,28 C40,28 60,12 100,12 C145,12 170,32 220,32 C260,32 280,10 300,20"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="12" r="3" className="fill-[#5C8266]" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] font-sans text-[#8E9B95] mt-1.5 ml-1">
        {timestamp}
      </div>
    </div>
  )
}

/**
 * Format markdown/raw AI text into beautiful HTML matching the clinical layout
 */
function formatClinicalContent(rawText) {
  if (!rawText) return ''

  let text = rawText

  // Replace markdown headers with italic serif subheadings
  text = text.replace(/### (.*?)\n/g, '<h3 class="font-serif italic text-lg font-medium text-[#2D4A3E] mt-3 mb-1">$1</h3>')
  text = text.replace(/## (.*?)\n/g, '<h3 class="font-serif italic text-xl font-medium text-[#2D4A3E] mt-4 mb-1">$1</h3>')
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#A03E24] font-semibold">$1</strong>')
  text = text.replace(/\n\n/g, '</p><p class="mb-3">')

  return `<p class="mb-3">${text}</p>`
}
