export type UserRole = 'ADMIN' | 'ORGANIZER' | 'ATTENDEE'
export type EventCategory =
  | 'CONFERENCE'
  | 'WORKSHOP'
  | 'SEMINAR'
  | 'SPORTS'
  | 'CULTURAL'
  | 'NETWORKING'
  | 'OTHER'

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  bio?: string
  avatar?: string
  password?: string
  createdAt: string
}

export interface EventRecord {
  id: string
  title: string
  description: string
  category: EventCategory
  location: string
  startDateTime: string
  endDateTime: string
  registrationDeadline: string
  imageUrl?: string
  capacity: number
  organizerId: string
  organizerName: string
  isCancelled: boolean
}

const USER_KEY = 'eventflow_user'
const TOKEN_KEY = 'eventflow_token'
const USERS_KEY = 'eventflow_users'
const EVENTS_KEY = 'eventflow_events'

const seedUsers: AppUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
    bio: 'Platform administrator',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'org-1',
    name: 'Maya Chen',
    email: 'organizer@example.com',
    password: 'organizer123',
    role: 'ORGANIZER',
    bio: 'Event strategist',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'att-1',
    name: 'Alex Johnson',
    email: 'attendee@example.com',
    password: 'attendee123',
    role: 'ATTENDEE',
    bio: 'Community organizer and event enthusiast.',
    createdAt: new Date().toISOString(),
  },
]

const seedEvents: EventRecord[] = [
  {
    id: 'event-1',
    title: 'Product Summit',
    description: 'A full-day conference focused on product strategy, roadmap planning, and customer research.',
    category: 'CONFERENCE',
    location: 'City Hall',
    startDateTime: '2026-09-14T09:00:00.000Z',
    endDateTime: '2026-09-14T17:00:00.000Z',
    registrationDeadline: '2026-09-10T23:59:00.000Z',
    capacity: 120,
    organizerId: 'org-1',
    organizerName: 'Maya Chen',
    isCancelled: false,
  },
  {
    id: 'event-2',
    title: 'Startup Mixer',
    description: 'Meet founders, investors, and developers in a relaxed networking session.',
    category: 'NETWORKING',
    location: 'Harbor Lounge',
    startDateTime: '2026-09-20T18:30:00.000Z',
    endDateTime: '2026-09-20T22:00:00.000Z',
    registrationDeadline: '2026-09-18T23:59:00.000Z',
    capacity: 80,
    organizerId: 'org-1',
    organizerName: 'Maya Chen',
    isCancelled: false,
  },
  {
    id: 'event-3',
    title: 'Design Systems Lab',
    description: 'A hands-on workshop for creating scalable, consistent design patterns across teams.',
    category: 'WORKSHOP',
    location: 'North Studio',
    startDateTime: '2026-10-02T10:00:00.000Z',
    endDateTime: '2026-10-02T13:00:00.000Z',
    registrationDeadline: '2026-09-28T23:59:00.000Z',
    capacity: 50,
    organizerId: 'org-1',
    organizerName: 'Maya Chen',
    isCancelled: false,
  },
]

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const ensureSeedData = () => {
  const users = readJson<AppUser[]>(USERS_KEY, [])
  if (!users.length) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
  }

  const events = readJson<EventRecord[]>(EVENTS_KEY, [])
  if (!events.length) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(seedEvents))
  }
}

export const getUsers = () => {
  ensureSeedData()
  return readJson<AppUser[]>(USERS_KEY, seedUsers)
}

export const setUsers = (users: AppUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getCurrentUser = (): AppUser | null => {
  return readJson<AppUser | null>(USER_KEY, null)
}

export const setCurrentUser = (user: AppUser | null) => {
  if (!user) {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    return
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, 'demo-token')
}

export const logout = () => {
  setCurrentUser(null)
}

export const getEvents = () => {
  ensureSeedData()
  return readJson<EventRecord[]>(EVENTS_KEY, seedEvents)
}

export const setEvents = (events: EventRecord[]) => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export const saveEvents = (events: EventRecord[]) => {
  setEvents(events)
}

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) ?? 'demo-token'
}
