import { Bell, LogOut } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Brand } from './Brand'
import { BottomNavigation } from './BottomNavigation'
import { Navigation } from './Navigation'

export function AppLayout() {
  const { user, signOut } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'
  return <div className="min-h-screen bg-cream"><header className="sticky top-0 z-20 border-b border-sand bg-white"><div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 lg:px-8"><Brand /><div className="flex items-center gap-2"><button className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-cocoa/65 hover:bg-sand" aria-label="Notifications"><Bell size={20} /></button>{user && <button onClick={() => void signOut()} className="focus-ring hidden min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-cocoa/65 hover:bg-sand sm:flex" aria-label="Sign out"><LogOut size={18} />Sign out</button>}</div></div></header><div className="mx-auto flex max-w-7xl"><Navigation /><main className="min-w-0 flex-1 px-5 py-7 pb-28 lg:px-10 lg:py-10"><Outlet context={{ firstName }} /></main></div><BottomNavigation /></div>
}
