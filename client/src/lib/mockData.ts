export type Role = 'ADMIN' | 'ORGANIZER' | 'ATTENDEE'

export type EventCategory =
  | 'Conference'
  | 'Workshop'
  | 'Seminar'
  | 'Sports'
  | 'Cultural'
  | 'Networking'
  | 'Other'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
}

export interface EventItem {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: EventCategory
  capacity: number
  organizerId: string
  organizerName: string
  registeredCount: number
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  userName: string
  eventTitle: string
}

export interface AppState {
  users: User[]
  events: EventItem[]
  registrations: Registration[]
  currentUserId: string | null
}

const STORAGE_KEY = 'event-management-state-v1'

const seedUsers: User[] = [
  {
    id: 'u-admin',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    id: 'u-organizer',
    name: 'Maya Chen',
    email: 'organizer@example.com',
    password: 'organizer123',
    role: 'ORGANIZER',
  },
  {
    id: 'u-attendee',
    name: 'Alex Johnson',
    email: 'attendee@example.com',
    password: 'attendee123',
    role: 'ATTENDEE',
  },
]

const seedEvents: EventItem[] = [
  {
    id: 'e-1',
    title: 'Product Summit',
    description: 'A full-day conference for product leaders, founders, and strategy teams.',
    date: '2026-09-14',
    time: '09:00',
    location: 'City Hall',
    category: 'Conference',
    capacity: 120,
    organizerId: 'u-organizer',
    organizerName: 'Maya Chen',
    registeredCount: 42,
  },
  {
    id: 'e-2',
    title: 'Startup Mixer',
    description: 'Network with founders, builders, and investors in a relaxed social setting.',
    date: '2026-09-20',
    time: '18:30',
    location: 'Harbor Lounge',
    category: 'Networking',
    capacity: 80,
    organizerId: 'u-organizer',
    organizerName: 'Maya Chen',
    registeredCount: 25,
  },
  {
    id: 'e-3',
    title: 'Design Systems Lab',
    description: 'Hands-on workshop covering design tokens, systems thinking, and consistent UI patterns.',
    date: '2026-10-02',
    time: '10:00',
    location: 'North Studio',
    category: 'Workshop',
    capacity: 50,
    organizerId: 'u-organizer',
    organizerName: 'Maya Chen',
    registeredCount: 18,
  },
]

const seedRegistrations: Registration[] = [
  {
    id: 'r-1',
    eventId: 'e-1',
    userId: 'u-attendee',
    userName: 'Alex Johnson',
    eventTitle: 'Product Summit',
  },
  {
    id: 'r-2',
    eventId: 'e-3',
    userId: 'u-attendee',
    userName: 'Alex Johnson',
    eventTitle: 'Design Systems Lab',
  },
]

const buildSeedState = (): AppState => ({
  users: seedUsers,
  events: seedEvents,
  registrations: seedRegistrations,
  currentUserId: null,
})

const syncEventCounts = (state: AppState) => {
  state.events = state.events.map((event) => ({
    ...event,
    registeredCount: state.registrations.filter((registration) => registration.eventId === event.id).length,
  }))
}

export const loadState = (): AppState => {
  if (typeof window === 'undefined') {
    return buildSeedState()
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY)
  if (!rawState) {
    const state = buildSeedState()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return state
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<AppState>
    const state: AppState = {
      users: parsed.users ?? seedUsers,
      events: parsed.events ?? seedEvents,
      registrations: parsed.registrations ?? seedRegistrations,
      currentUserId: parsed.currentUserId ?? null,
    }
    syncEventCounts(state)
    return state
  } catch {
    const state = buildSeedState()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return state
  }
}

const saveState = (state: AppState) => {
  if (typeof window !== 'undefined') {
    syncEventCounts(state)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export const getUsers = () => loadState().users
export const getEvents = () => loadState().events
export const getRegistrations = () => loadState().registrations

export const getCurrentUser = () => {
  const state = loadState()
  return state.users.find((user) => user.id === state.currentUserId) ?? null
}

export const setCurrentUser = (user: User | null) => {
  const state = loadState()
  state.currentUserId = user ? user.id : null
  saveState(state)
}

export const loginUser = (email: string, password: string) => {
  const state = loadState()
  const user = state.users.find(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password,
  )

  if (!user) {
    return null
  }

  state.currentUserId = user.id
  saveState(state)
  return user
}

export const registerUser = (name: string, email: string, password: string) => {
  const state = loadState()
  const trimmedEmail = email.trim().toLowerCase()

  if (state.users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
    return null
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    name: name.trim(),
    email: trimmedEmail,
    password,
    role: 'ATTENDEE',
  }

  state.users = [...state.users, newUser]
  state.currentUserId = newUser.id
  saveState(state)
  return newUser
}

export const logoutUser = () => {
  const state = loadState()
  state.currentUserId = null
  saveState(state)
}

export const getEventById = (eventId: string) => {
  return getEvents().find((event) => event.id === eventId) ?? null
}

export const getUserRegistrations = (userId: string) => {
  return getRegistrations().filter((registration) => registration.userId === userId)
}

export const createEvent = (eventData: Omit<EventItem, 'id' | 'registeredCount'>) => {
  const state = loadState()
  const newEvent: EventItem = {
    ...eventData,
    id: `e-${Date.now()}`,
    registeredCount: 0,
  }

  state.events = [newEvent, ...state.events]
  saveState(state)
  return newEvent
}

export const updateEvent = (eventId: string, updates: Partial<EventItem>) => {
  const state = loadState()
  const nextEvents = state.events.map((event) => (event.id === eventId ? { ...event, ...updates } : event))
  state.events = nextEvents
  saveState(state)
  return nextEvents.find((event) => event.id === eventId) ?? null
}

export const deleteEvent = (eventId: string) => {
  const state = loadState()
  state.events = state.events.filter((event) => event.id !== eventId)
  state.registrations = state.registrations.filter((registration) => registration.eventId !== eventId)
  saveState(state)
}

export const registerForEvent = (eventId: string, userId: string) => {
  const state = loadState()
  const event = state.events.find((entry) => entry.id === eventId)
  const user = state.users.find((entry) => entry.id === userId)

  if (!event || !user) {
    return null
  }

  if (state.registrations.some((registration) => registration.eventId === eventId && registration.userId === userId)) {
    return false
  }

  if (state.registrations.filter((registration) => registration.eventId === eventId).length >= event.capacity) {
    return false
  }

  const registration: Registration = {
    id: `r-${Date.now()}`,
    eventId,
    userId,
    userName: user.name,
    eventTitle: event.title,
  }

  state.registrations = [...state.registrations, registration]
  saveState(state)
  return true
}

export const cancelRegistration = (eventId: string, userId: string) => {
  const state = loadState()
  const nextRegistrations = state.registrations.filter(
    (registration) => !(registration.eventId === eventId && registration.userId === userId),
  )

  state.registrations = nextRegistrations
  saveState(state)
  return true
}

export const updateUserRole = (userId: string, role: Role) => {
  const state = loadState()
  state.users = state.users.map((user) => (user.id === userId ? { ...user, role } : user))
  saveState(state)
  return state.users.find((user) => user.id === userId) ?? null
}
