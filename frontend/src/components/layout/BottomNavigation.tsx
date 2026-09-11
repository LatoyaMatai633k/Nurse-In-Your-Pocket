import { CalendarDays, HeartPulse, House, MessageCircleHeart, Stethoscope, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: 'Home', icon: House },
  { to: '/chat', label: 'Nompilo', icon: MessageCircleHeart },
  { to: '/symptoms', label: 'Symptoms', icon: Stethoscope },
  { to: '/period', label: 'Cycle', icon: HeartPulse },
  { to: '/appointments', label: 'Visits', icon: CalendarDays },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export function BottomNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-white/95 backdrop-blur px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="mx-auto flex max-w-lg justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `focus-ring flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold transition ${
                isActive ? 'text-purple-700' : 'text-cocoa/50 hover:text-plum'
              }`
            }
          >
            <Icon size={20} strokeWidth={2.2} />
            <span className="tracking-tight">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
