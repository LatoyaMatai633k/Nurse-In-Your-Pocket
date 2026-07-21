import type { ReactNode } from 'react'
import { Card } from './Card'

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <Card className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sand text-terracotta">{icon}</div><h2 className="mt-4 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-cocoa/60">{children}</p></Card>
}
