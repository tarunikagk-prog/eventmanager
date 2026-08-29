import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEvent, getCurrentUser, getEventById, updateEvent } from '../lib/mockData'

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: 'Conference',
  capacity: '50',
}

export default function EventFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const currentUser = getCurrentUser()
  const existingEvent = id ? getEventById(id) : null
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (existingEvent) {
      setForm({
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        time: existingEvent.time,
        location: existingEvent.location,
        category: existingEvent.category,
        capacity: String(existingEvent.capacity),
      })
    }
  }, [existingEvent])

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'ORGANIZER')) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Access denied</h1>
        <p className="mt-4 text-slate-300">Only organizers and admins can manage events.</p>
      </div>
    )
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.title.trim() || !form.description.trim() || !form.date || !form.time || !form.location.trim()) {
      window.alert('Please complete all required fields.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      category: form.category as any,
      capacity: Number(form.capacity),
      organizerId: currentUser.id,
      organizerName: currentUser.name,
    }

    if (existingEvent) {
      updateEvent(existingEvent.id, payload)
      navigate(`/events/${existingEvent.id}`)
      return
    }

    createEvent(payload)
    navigate('/events')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white">{existingEvent ? 'Edit event' : 'Create event'}</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Title</label>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Location</label>
            <input
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Networking">Networking</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Capacity</label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => setForm({ ...form, capacity: event.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400">
              {existingEvent ? 'Save changes' : 'Create event'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 hover:border-slate-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
