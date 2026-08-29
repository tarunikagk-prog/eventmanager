import { useMemo } from 'react'
import { deleteEvent, getCurrentUser, getEvents, getUsers, updateUserRole } from '../lib/mockData'

export default function AdminPanelPage() {
  const currentUser = getCurrentUser()
  const users = getUsers()
  const events = getEvents()

  const stats = useMemo(() => ({
    users: users.length,
    events: events.length,
    organizers: users.filter((user) => user.role === 'ORGANIZER').length,
    attendees: users.filter((user) => user.role === 'ATTENDEE').length,
  }), [events.length, users])

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Access denied</h1>
      </div>
    )
  }

  const handleRoleChange = (userId: string, role: 'ADMIN' | 'ORGANIZER' | 'ATTENDEE') => {
    updateUserRole(userId, role)
    window.location.reload()
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-200">Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Admin panel</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Users', String(stats.users)],
          ['Events', String(stats.events)],
          ['Organizers', String(stats.organizers)],
          ['Attendees', String(stats.attendees)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Manage users</h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <select
                  value={user.role}
                  onChange={(event) => handleRoleChange(user.id, event.target.value as 'ADMIN' | 'ORGANIZER' | 'ATTENDEE')}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="ORGANIZER">Organizer</option>
                  <option value="ATTENDEE">Attendee</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Manage events</h2>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <p className="font-medium text-white">{event.title}</p>
                  <p className="text-sm text-slate-400">{event.date}</p>
                </div>
                <button onClick={() => handleDeleteEvent(event.id)} className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
