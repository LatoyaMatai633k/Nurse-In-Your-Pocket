import React from 'react'

interface BrandProps {
  minimal?: boolean
  className?: string
}

export function Brand({ minimal = false, className = '' }: BrandProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon SVG */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-sm ring-4 ring-purple-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          {/* Heart with Stethoscope / Care */}
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 9v4" strokeWidth="2.5" />
          <path d="M10 11h4" strokeWidth="2.5" />
        </svg>
      </div>

      {!minimal && (
        <div className="flex flex-col">
          <span className="text-lg font-extrabold tracking-tight text-plum leading-tight">
            Nurse in Your Pocket
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-purple-600 uppercase">
            Your Health. Our Priority.
          </span>
        </div>
      )}
    </div>
  )
}
