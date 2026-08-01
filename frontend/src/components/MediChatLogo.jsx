import React from 'react'

/**
 * MediChat Heart + Leaf Brand Logo SVG Component
 * Exact match for Image 3 in the design reference.
 */
export default function MediChatLogo({ className = "w-6 h-6", color = "#5C8266" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Heart outer path interwoven with leaf */}
      <path
        d="M50 28.5C41.2 -1.5 8 13.5 15.5 44.5C23 75.5 50 89 50 89C50 89 77 75.5 84.5 44.5C92 13.5 58.8 -1.5 50 28.5Z"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Internal leaf vein path */}
      <path
        d="M49 88.5C49 88.5 73.5 68 76 43C78.5 18 51.5 29 51.5 29"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M51.5 61.5C62.5 51.5 67 43 67 43"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}
