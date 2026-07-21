import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, id, className = '', ...props }, ref) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-semibold text-cocoa">{label}</span>
      <input ref={ref} id={inputId} className={`focus-ring min-h-13 w-full rounded-2xl border bg-white px-4 text-base text-cocoa placeholder:text-cocoa/35 ${error ? 'border-rose' : 'border-sand'} ${className}`} {...props} />
      {error && <span className="mt-1.5 block text-xs font-medium text-rose">{error}</span>}
    </label>
  )
})
