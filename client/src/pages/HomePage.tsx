import { Link } from 'react-router-dom'
import { getCurrentUser, getEvents } from '../lib/mockData'

export default function HomePage() {
  const currentUser = getCurrentUser()
  const events = getEvents()

  const stats = {
    events: events.length,
    registrations: events.reduce((sum, event) => sum + event.registeredCount, 0),
    upcoming: events.filter((event) => new Date(event.date).getTime() >= Date.now()).length,
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
            Event management platform
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Discover events worth showing up for.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Manage registrations, organize events, and keep your community engaged with a simple and fast event platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={currentUser ? '/dashboard' : '/register'}
              className="btn-primary rounded-full px-6 py-3 font-medium text-white"
            >
              {currentUser ? 'Go to dashboard' : 'Get started'}
            </Link>
            <Link
              to="/events"
              className="btn-secondary rounded-full px-6 py-3 font-medium text-slate-100"
            >
              Browse events
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-indigo-950/30">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="stat-card rounded-2xl p-4">
              <p className="text-sm text-slate-400">Events</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.events}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/25 to-pink-500/20 p-4 ring-1 ring-indigo-400/20">
              <p className="text-sm text-indigo-100">Registrations</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.registrations}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/20 p-4 md:col-span-2 ring-1 ring-emerald-400/20">
              <p className="text-sm text-emerald-100">Upcoming</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.upcoming}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          ['Built for every role', 'Admins manage users, organizers publish events, and attendees register quickly.'],
          ['Search and filtering', 'Find event types, locations, and dates without friction.'],
          ['Simple local workflow', 'Runs with mock data immediately, so the app is ready without any backend setup.'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 h-11 w-11 rounded-xl bg-indigo-500/20" />
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-slate-300">{description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
