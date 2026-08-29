import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, getEvents, getRegistrations } from '../lib/mockData'

export default function DashboardPage() {
  const currentUser = getCurrentUser()
  const events = getEvents()
  const registrations = getRegistrations()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d')

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Please log in</h1>
        <p className="mt-3 text-slate-300">Sign in to access your dashboard.</p>
      </div>
    )
  }

  const myRegistrations = registrations.filter((registration) => registration.userId === currentUser.id)

  const stats = useMemo(() => {
    const rangeDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : Number.MAX_SAFE_INTEGER
    const visibleEvents = events.filter((event) => {
      const eventDate = new Date(event.date).getTime()
      const now = Date.now()
      const diffDays = (eventDate - now) / (1000 * 60 * 60 * 24)
      return diffDays <= rangeDays && diffDays >= -30
    })

    return {
      totalEvents: events.length,
      totalRegistrations: registrations.length,
      myRegistrations: myRegistrations.length,
      upcomingEvents: events.filter((event) => new Date(event.date).getTime() >= Date.now()).length,
      filteredEvents: visibleEvents.length,
    }
  }, [events, myRegistrations.length, registrations.length, timeRange])

  const featuredEvents = [...events].slice(0, 3)
  const nextEvent = events[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="rounded-[28px] border border-slate-800 bg-black p-4 shadow-2xl shadow-indigo-950/30 sm:p-6 lg:p-8">
        <header className="mb-8 rounded-[24px] border border-indigo-500/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100">Overview</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">Welcome back, {currentUser.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="select-shell">
                <label htmlFor="time-range" className="sr-only">Select time range</label>
                <select
                  id="time-range"
                  value={timeRange}
                  onChange={(event) => setTimeRange(event.target.value as '7d' | '30d' | 'all')}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-300"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total events', String(stats.totalEvents)],
            ['Upcoming', String(stats.upcomingEvents)],
            ['Registrations', String(stats.totalRegistrations)],
            ['My bookings', String(stats.myRegistrations)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[22px] border border-indigo-500/20 bg-gradient-to-r from-indigo-600 to-blue-500 p-5 shadow-lg shadow-blue-900/30">
              <p className="text-xs uppercase tracking-[0.22em] text-blue-100">{label}</p>
              <p className="mt-4 text-4xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5">
            <div className="space-y-4">
              {featuredEvents.map((event) => (
                <div key={event.id} className="rounded-[20px] border border-slate-700 bg-slate-900/80 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{event.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{event.date} • {event.location}</p>
                    </div>
                    <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-200">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Milestone</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{nextEvent?.title ?? 'No events yet'}</h3>
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-4">
                <p className="text-sm text-blue-100">{nextEvent?.date ?? 'TBD'} • {nextEvent?.location ?? 'Venue pending'}</p>
                <p className="mt-2 text-3xl font-black text-white">{stats.filteredEvents}</p>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5">
              <div className="space-y-3">
                <Link to="/events" className="block rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-4 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                  Events
                </Link>
                <Link to="/my-registrations" className="block rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 px-4 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                  Sign in
                </Link>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'ORGANIZER') && (
                  <Link to="/events/new" className="block rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-4 py-4 text-center text-sm font-bold text-white shadow-lg shadow-cyan-900/30">
                    New event
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
