interface BrandProps {
  minimal?: boolean
  className?: string
}

export function Brand({ minimal = false, className = '' }: BrandProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src="/images/nurse-in-your-pocket-logo.jpeg" className="h-12 w-12 shrink-0 rounded-full object-cover" alt="Nurse in Your Pocket" />

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
