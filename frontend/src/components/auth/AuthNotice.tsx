import { Info } from 'lucide-react'

export function AuthNotice({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2.5 rounded-2xl border border-nude bg-sand/55 p-3 text-xs leading-5 text-cocoa/70"><Info className="mt-0.5 shrink-0 text-terracotta" size={16} />{children}</div>
}
