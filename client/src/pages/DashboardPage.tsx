import { Link } from 'react-router-dom'
import { getCurrentUser, getEvents, getRegistrations } from '../lib/mockData'

export default function DashboardPage() {
  const currentUser = getCurrentUser()
  const events = getEvents()
  const registrations = getRegistrations()

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Please log in</h1>
        <p className="mt-3 text-slate-300">Sign in to access your dashboard.</p>
      </div>
    )
  }

  const myRegistrations = registrations.filter((registration) => registration.userId === currentUser.id)

  const stats = {
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    myRegistrations: myRegistrations.length,
    upcomingEvents: events.filter((event) => new Date(event.date).getTime() >= Date.now()).length,
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-200">Overview</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-300">Welcome back, {currentUser.name}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total events', String(stats.totalEvents), 'from-indigo-500/25 to-indigo-500/5'],
          ['Upcoming', String(stats.upcomingEvents), 'from-cyan-500/25 to-cyan-500/5'],
          ['Total registrations', String(stats.totalRegistrations), 'from-pink-500/25 to-pink-500/5'],
          ['My registrations', String(stats.myRegistrations), 'from-emerald-500/25 to-emerald-500/5'],
        ].map(([label, value, gradient]) => (
          <div key={label} className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${gradient} p-5`}>
            <p className="text-sm text-slate-300">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Recent events</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            {events.map((event) => (
              <li key={event.id} className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/60 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{event.title}</p>
                  <p className="text-sm text-slate-400">{event.date} • {event.location}</p>
                </div>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-200">
                  {event.category}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link to="/events" className="btn-secondary block rounded-xl px-4 py-3 text-center text-slate-100">
              Browse all events
            </Link>
            <Link to="/my-registrations" className="btn-secondary block rounded-xl px-4 py-3 text-center text-slate-100">
              View my registrations
            </Link>
            {(currentUser.role === 'ADMIN' || currentUser.role === 'ORGANIZER') && (
              <Link to="/events/new" className="btn-primary block rounded-xl px-4 py-3 text-center font-medium text-white">
                Create a new event
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
