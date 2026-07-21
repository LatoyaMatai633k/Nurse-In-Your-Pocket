import { HeartPulse } from 'lucide-react'

export function Brand() {
  return <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-terracotta text-white"><HeartPulse size={22} strokeWidth={2.4} /></span><span className="font-display text-lg font-bold leading-5 text-cocoa">Nurse in<br />Your Pocket</span></div>
}
