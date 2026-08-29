import { Link, useNavigate, useParams } from 'react-router-dom'
import { cancelRegistration, deleteEvent, getCurrentUser, getEventById, getRegistrations, registerForEvent } from '../lib/mockData'

export default function EventDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const currentUser = getCurrentUser()
  const event = id ? getEventById(id) : null
  const registrations = event ? getRegistrations().filter((registration) => registration.eventId === event.id) : []

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Event not found</h1>
        <Link to="/events" className="mt-5 inline-block rounded-full bg-indigo-500 px-5 py-3 text-white">
          Back to events
        </Link>
      </div>
    )
  }

  const alreadyRegistered = currentUser
    ? registrations.some((registration) => registration.userId === currentUser.id)
    : false

  const handleRegister = () => {
    if (!currentUser) {
      window.alert('Please log in to register.')
      return
    }

    const ok = registerForEvent(event.id, currentUser.id)
    if (!ok) {
      window.alert('You are already registered or the event is full.')
      return
    }

    navigate(0)
  }

  const handleCancel = () => {
    if (!currentUser) return
    cancelRegistration(event.id, currentUser.id)
    navigate(0)
  }

  const handleDelete = () => {
    deleteEvent(event.id)
    navigate('/events')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <div className="h-56 bg-gradient-to-br from-indigo-600 via-cyan-500 to-slate-900" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
                {event.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{event.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {(currentUser?.role === 'ADMIN' || currentUser?.role === 'ORGANIZER') && (
                <Link to={`/events/${event.id}/edit`} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500">
                  Edit
                </Link>
              )}
              {(currentUser?.role === 'ADMIN' || currentUser?.role === 'ORGANIZER') && (
                <button onClick={handleDelete} className="rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20">
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Date</p>
              <p className="mt-2 text-lg font-semibold text-white">{event.date}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Time</p>
              <p className="mt-2 text-lg font-semibold text-white">{event.time}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Capacity</p>
              <p className="mt-2 text-lg font-semibold text-white">{event.registeredCount}/{event.capacity}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <div>
              <h2 className="text-xl font-semibold text-white">Description</h2>
              <p className="mt-3 text-slate-300">{event.description}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Location</p>
              <p className="mt-2 text-lg font-semibold text-white">{event.location}</p>
              <p className="mt-4 text-sm text-slate-400">Organizer</p>
              <p className="mt-2 text-lg font-semibold text-white">{event.organizerName}</p>

              <div className="mt-6">
                {alreadyRegistered ? (
                  <button onClick={handleCancel} className="w-full rounded-xl bg-rose-500 px-4 py-3 font-medium text-white hover:bg-rose-400">
                    Cancel registration
                  </button>
                ) : (
                  <button onClick={handleRegister} className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-400">
                    Register now
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h2 className="text-xl font-semibold text-white">Registered attendees</h2>
            <div className="mt-4 space-y-3">
              {registrations.length ? (
                registrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                    <span className="text-slate-200">{registration.userName}</span>
                    <span className="text-sm text-slate-400">Registered</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No attendees registered yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
