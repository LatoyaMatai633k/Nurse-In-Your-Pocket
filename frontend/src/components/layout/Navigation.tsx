import { BookOpen, CalendarDays, CircleUserRound, HeartPulse, House, MessageCircleHeart, Settings, Stethoscope } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export const navItems = [
  { to: '/dashboard', label: 'Home', icon: House },
  { to: '/chat', label: 'Nompilo', icon: MessageCircleHeart },
  { to: '/symptoms', label: 'Symptoms', icon: Stethoscope },
  { to: '/period', label: 'Period tracker', icon: HeartPulse },
  { to: '/library', label: 'Health library', icon: BookOpen },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/profile', label: 'Health profile', icon: CircleUserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation() {
  return <nav className="hidden w-64 shrink-0 border-r border-sand bg-white px-4 py-7 lg:block" aria-label="Main navigation">
    <div className="space-y-1">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `focus-ring flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition ${isActive ? 'bg-sand text-terracotta' : 'text-cocoa/65 hover:bg-cream hover:text-cocoa'}`}><Icon size={19} />{label}</NavLink>)}</div>
  </nav>
}
