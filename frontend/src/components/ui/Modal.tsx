import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 flex items-end bg-cocoa/35 p-4 sm:items-center sm:justify-center" role="presentation" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift" onMouseDown={(event) => event.stopPropagation()}>
      <div className="mb-5 flex items-center justify-between"><h2 id="modal-title" className="font-display text-2xl font-bold">{title}</h2><button onClick={onClose} className="focus-ring rounded-xl p-2 text-cocoa/60 hover:bg-sand" aria-label="Close"><X size={20} /></button></div>
      {children}
    </section>
  </div>
}
