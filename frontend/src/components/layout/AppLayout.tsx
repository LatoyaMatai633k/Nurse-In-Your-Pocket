import { Bell, LogOut, Menu, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Brand } from './Brand'
import { BottomNavigation } from './BottomNavigation'
import { Navigation } from './Navigation'

export function AppLayout() {
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const fullName = user?.user_metadata?.full_name || ''
  const firstName = fullName.trim() ? fullName.trim().split(' ')[0] : 'there'

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-sand bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="focus-ring rounded-xl p-2 text-plum hover:bg-purple-50 lg:hidden"
              aria-label="Open menu drawer"
            >
              <Menu size={22} />
            </button>
            <Brand minimal={false} className="lg:hidden" />
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Capsule */}
            <Link
              to="/profile"
              className="focus-ring hidden items-center gap-2 rounded-2xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-900 hover:bg-purple-100 sm:flex"
            >
              <UserCheck size={16} className="text-purple-700" />
              <span>{firstName}</span>
            </Link>

            <button
              className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-cocoa/70 hover:bg-purple-50 hover:text-purple-900"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            {user && (
              <button
                onClick={() => void signOut()}
                className="focus-ring hidden min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-rose hover:bg-rose/10 sm:flex"
                aria-label="Sign out"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Layout with Sidebar */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Navigation
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />
        
        <main className="min-w-0 flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-8">
          <Outlet context={{ firstName }} />
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}
