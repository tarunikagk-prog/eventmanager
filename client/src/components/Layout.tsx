import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../lib/mockData'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link to="/" className="text-lg font-black tracking-[0.18em] text-white uppercase">
            EVENT HUB
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-slate-300">
            <Link to="/" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Home</Link>
            <Link to="/events" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Events</Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Dashboard</Link>
                <Link to="/my-registrations" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">My Registrations</Link>
                {currentUser.role === 'ADMIN' ? <Link to="/admin" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Admin</Link> : null}
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary rounded-full px-4 py-2 font-medium text-white">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
