import type { ReactNode } from 'react'
import { Card } from './Card'

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <Card className="text-center border border-sand py-8 px-6">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-800 shadow-sm">
        {icon}
      </div>
      <h2 className="mt-4 text-base font-bold text-plum">{title}</h2>
      <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/65 max-w-md mx-auto">{children}</p>
    </Card>
  )
}
