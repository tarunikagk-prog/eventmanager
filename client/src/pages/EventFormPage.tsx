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

const hostSteps = [
  { title: 'Host profile', note: 'Set up your event identity', value: '01' },
  { title: 'Event details', note: 'Cover date, venue and format', value: '02' },
  { title: 'Publish & grow', note: 'Launch seats and promo reach', value: '03' },
]

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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Host with us</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white md:text-5xl">
            {existingEvent ? 'Edit your event' : 'Create your event'}
          </h1>
        </div>

        <div className="flex gap-3">
          <button type="button" className="rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-medium text-slate-200">
            Drafts
          </button>
          <button type="button" className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30">
            Preview
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {hostSteps.map((step) => (
          <div key={step.value} className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">{step.value}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{step.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[30px] border border-slate-800 bg-slate-900/90 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Event title</label>
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Midnight Strings Festival"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Tell attendees what makes your event special..."
                className="h-28 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(event) => setForm({ ...form, time: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Location</label>
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                placeholder="Bengaluru, India"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Category</label>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
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
                <label className="mb-2 block text-sm font-medium text-slate-300">Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) => setForm({ ...form, capacity: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button type="submit" className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-base font-bold text-white shadow-lg shadow-orange-950/30 transition hover:brightness-110">
                {existingEvent ? 'Save changes' : 'Create event'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="rounded-full border border-slate-700 bg-slate-950/80 px-6 py-3 text-base font-medium text-slate-200 transition hover:border-slate-500">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-[30px] border border-slate-800 bg-slate-900/90 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.45)]">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Live preview</p>
          <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-800 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"
              alt="Featured event"
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <span>Bengaluru</span>
                <span>12 Aug</span>
              </div>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.05em] text-white">Sunset Live</h3>
              <p className="mt-2 text-sm text-slate-400">{form.location || 'Bengaluru, India'} • {form.time || '7:00 PM'}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">From</p>
                  <p className="text-xl font-black text-orange-300">₹{form.capacity || '899'}</p>
                </div>
                <button type="button" className="rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-200">
                  Book now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[20px] border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Host checklist</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Event title ready</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Venue details added</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> Promo image optional</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
