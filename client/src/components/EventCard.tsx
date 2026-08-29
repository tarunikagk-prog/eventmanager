import { Link } from 'react-router-dom'
import type { EventItem } from '../lib/mockData'

interface EventCardProps {
  event: EventItem
  registered: boolean
  currentUserRole?: string | null
  onRegister?: (eventId: string) => void
  onCancel?: (eventId: string) => void
  onEdit?: (eventId: string) => void
  onDelete?: (eventId: string) => void
}

const categoryColors: Record<string, string> = {
  Conference: 'bg-violet-500/15 text-violet-200 border-violet-500/30',
  Workshop: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30',
  Seminar: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
  Sports: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  Cultural: 'bg-pink-500/15 text-pink-200 border-pink-500/30',
  Networking: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
  Other: 'bg-slate-600/20 text-slate-200 border-slate-500/30',
}

export function EventCard({
  event,
  registered,
  currentUserRole,
  onRegister,
  onCancel,
  onEdit,
  onDelete,
}: EventCardProps) {
  const registeredCount = event.registeredCount ?? 0
  const isManager = currentUserRole === 'ADMIN' || currentUserRole === 'ORGANIZER'

  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-2xl shadow-xl shadow-indigo-950/20">
      <div className="h-32 bg-gradient-to-br from-indigo-600 via-cyan-500 to-pink-500" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${categoryColors[event.category] ?? categoryColors.Other}`}>
            {event.category}
          </span>
          <span className="text-xs text-slate-400">{registeredCount}/{event.capacity} joined</span>
        </div>

        <h3 className="text-xl font-semibold text-white">{event.title}</h3>

        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>{event.date} • {event.time}</p>
          <p>{event.location}</p>
          <p className="text-slate-400">Organized by {event.organizerName}</p>
        </div>

        <p className="mt-4 line-clamp-3 text-sm text-slate-400">{event.description}</p>

        <div className="mt-5 flex gap-2 pt-2">
          <Link
            to={`/events/${event.id}`}
            className="btn-secondary inline-flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-slate-100"
          >
            View
          </Link>

          {onRegister && !registered && (
            <button
              onClick={() => onRegister(event.id)}
              className="btn-primary inline-flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-white"
            >
              Register
            </button>
          )}

          {onCancel && registered && (
            <button
              onClick={() => onCancel(event.id)}
              className="btn-danger inline-flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-white"
            >
              Cancel
            </button>
          )}
        </div>

        {isManager && (onEdit || onDelete) ? (
          <div className="mt-3 flex gap-2">
            {onEdit ? (
              <button
                onClick={() => onEdit(event.id)}
                className="flex-1 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                onClick={() => onDelete(event.id)}
                className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20"
              >
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
