import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  fullWidth?: boolean
  loading?: boolean
}

const styles = {
  // Normal: Purple background, White text; Hover: Cream background, Purple text, Purple border
  primary:
    'bg-purple-700 text-white border border-purple-700 hover:bg-cream hover:text-purple-700 hover:border-purple-700 active:bg-purple-100',
  secondary:
    'bg-white text-plum border border-sand hover:bg-cream hover:border-purple-300 active:bg-purple-50 shadow-sm',
  ghost:
    'bg-transparent text-purple-700 border border-transparent hover:bg-purple-100/60 active:bg-purple-100',
  danger:
    'bg-rose text-white border border-rose hover:bg-cream hover:text-rose hover:border-rose active:bg-rose/10',
}

export function Button({
  children,
  variant = 'primary',
  fullWidth,
  loading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
