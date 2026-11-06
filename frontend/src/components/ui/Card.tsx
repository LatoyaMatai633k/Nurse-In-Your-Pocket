import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <section className={`rounded-3xl bg-white p-5 shadow-card ${className}`} {...props}>{children}</section>
}
