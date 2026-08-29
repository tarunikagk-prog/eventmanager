import { Link } from 'react-router-dom'
import { getCurrentUser, getRegistrations } from '../lib/mockData'

export default function MyRegistrationsPage() {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Please log in</h1>
        <p className="mt-3 text-slate-300">You need an account to see your registrations.</p>
      </div>
    )
  }

  const registrations = getRegistrations().filter((registration) => registration.userId === currentUser.id)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-200">Tickets</p>
        <h1 className="mt-2 text-3xl font-bold text-white">My registrations</h1>
      </div>

      <div className="space-y-4">
        {registrations.length ? (
          registrations.map((registration) => (
            <div key={registration.id} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-semibold text-white">{registration.eventTitle}</p>
                <p className="mt-1 text-sm text-slate-400">Confirmed registration</p>
              </div>
              <Link to={`/events/${registration.eventId}`} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500">
                View event
              </Link>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            You have not registered for any events yet.
          </div>
        )}
      </div>
    </div>
  )
}
