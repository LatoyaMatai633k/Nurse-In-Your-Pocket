import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-plum/40 backdrop-blur-sm p-4 sm:items-center sm:justify-center"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-sand"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-sand pb-3">
          <h2 id="modal-title" className="text-xl font-bold text-plum">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="focus-ring rounded-xl p-1.5 text-cocoa/50 hover:bg-purple-100 hover:text-purple-900"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
