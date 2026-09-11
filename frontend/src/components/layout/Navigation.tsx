import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  HeartPulse,
  House,
  LogOut,
  MessageCircleHeart,
  Settings,
  Stethoscope,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Brand } from './Brand'

export const navItems = [
  { to: '/dashboard', label: 'Home', icon: House },
  { to: '/chat', label: 'Nompilo AI', icon: MessageCircleHeart },
  { to: '/symptoms', label: 'Symptom Checker', icon: Stethoscope },
  { to: '/period', label: 'Period Tracker', icon: HeartPulse },
  { to: '/library', label: 'Health Library', icon: BookOpen },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/profile', label: 'Health Profile', icon: CircleUserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface NavigationProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  isMobileDrawerOpen?: boolean
  onCloseMobileDrawer?: () => void
}

export function Navigation({
  collapsed = false,
  onToggleCollapse,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}: NavigationProps) {
  const { signOut } = useAuth()

  // Sidebar content component used in both desktop sidebar & mobile drawer
  const NavContent = ({ isDrawer = false }: { isDrawer?: boolean }) => (
    <div className="flex h-full flex-col justify-between">
      <div>
        {isDrawer ? (
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <Brand />
            <button
              onClick={onCloseMobileDrawer}
              className="focus-ring rounded-xl p-2 text-cocoa/70 hover:bg-sand"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-between">
            {!collapsed && <Brand />}
            {collapsed && <Brand minimal />}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="focus-ring hidden rounded-xl p-1.5 text-cocoa/50 hover:bg-purple-100 hover:text-purple-700 lg:block"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            )}
          </div>
        )}

        <div className="mt-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                if (isDrawer && onCloseMobileDrawer) {
                  onCloseMobileDrawer()
                }
              }}
              title={collapsed && !isDrawer ? label : undefined}
              className={({ isActive }) =>
                `focus-ring group flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold transition duration-150 ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-cocoa/70 hover:bg-purple-100/60 hover:text-purple-900'
                } ${collapsed && !isDrawer ? 'justify-center px-0' : ''}`
              }
            >
              <Icon size={20} className="shrink-0" />
              {(!collapsed || isDrawer) && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="border-t border-sand pt-4">
        <button
          onClick={() => void signOut()}
          title={collapsed && !isDrawer ? 'Sign out' : undefined}
          className={`focus-ring flex w-full min-h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold text-rose hover:bg-rose/10 transition duration-150 ${
            collapsed && !isDrawer ? 'justify-center px-0' : ''
          }`}
          aria-label="Sign out"
        >
          <LogOut size={19} className="shrink-0" />
          {(!collapsed || isDrawer) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden border-r border-sand bg-white px-4 py-6 transition-all duration-200 lg:block shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        aria-label="Sidebar navigation"
      >
        <NavContent />
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-plum/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileDrawer}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-white p-5 shadow-2xl">
            <NavContent isDrawer />
          </div>
        </div>
      )}
    </>
  )
}
