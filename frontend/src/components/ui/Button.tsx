import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  fullWidth?: boolean
  loading?: boolean
}

const styles = {
  primary: 'bg-terracotta text-white hover:bg-cocoa active:bg-white active:text-terracotta active:ring-1 active:ring-terracotta',
  secondary: 'bg-sand text-cocoa hover:bg-nude active:bg-white active:text-terracotta active:ring-1 active:ring-terracotta',
  ghost: 'bg-transparent text-terracotta hover:bg-sand/70 active:bg-white active:ring-1 active:ring-terracotta',
  danger: 'bg-rose text-white hover:bg-[#ad6e6e] active:bg-white active:text-rose active:ring-1 active:ring-rose',
}

export function Button({ children, variant = 'primary', fullWidth, loading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </button>
  )
}
