import { Brand } from '../layout/Brand'
import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-cream px-5 py-8 sm:grid sm:place-items-center"><div className="mx-auto w-full max-w-md"><div className="mb-10"><Brand /></div>{children}<p className="mx-auto mt-8 max-w-sm text-center text-xs leading-5 text-cocoa/50">Nurse in Your Pocket supports your health journey with trusted information. It does not replace a doctor or nurse.</p></div></main>
}
