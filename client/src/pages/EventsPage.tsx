import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { PageHeader } from '../components/PageHeader'
import { cancelRegistration, getCurrentUser, getEvents, getRegistrations, registerForEvent } from '../lib/mockData'

export default function EventsPage() {
  const currentUser = getCurrentUser()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [events, setEvents] = useState(() => getEvents())

  const userRegistrations = useMemo(
    () => (currentUser ? getRegistrations().filter((registration) => registration.userId === currentUser.id) : []),
    [currentUser],
  )

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search || event.title.toLowerCase().includes(search.toLowerCase()) || event.location.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || event.category === category
      return matchesSearch && matchesCategory
    })
  }, [category, events, search])

  const handleRegister = (eventId: string) => {
    if (!currentUser) {
      window.alert('Please log in to register.')
      return
    }

    const result = registerForEvent(eventId, currentUser.id)
    if (result === false) {
      window.alert('Duplicate registration or event is full.')
      return
    }

    setEvents(getEvents())
  }

  const handleCancel = (eventId: string) => {
    if (!currentUser) return
    cancelRegistration(eventId, currentUser.id)
    setEvents(getEvents())
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Browse"
        title="Upcoming events"
        description="Search and filter upcoming events across categories."
        action={
          currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'ORGANIZER') ? (
            <Link
              to="/events/new"
              className="rounded-full bg-indigo-500 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-400"
            >
              Create event
            </Link>
          ) : null
        }
      />

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or location"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        >
          <option value="All">All categories</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
          <option value="Networking">Networking</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            registered={userRegistrations.some((registration) => registration.eventId === event.id)}
            currentUserRole={currentUser?.role ?? null}
            onRegister={handleRegister}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  )
}
