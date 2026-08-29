export type UserRole = 'ADMIN' | 'ORGANIZER' | 'ATTENDEE'

export type EventCategory =
  | 'CONFERENCE'
  | 'WORKSHOP'
  | 'SEMINAR'
  | 'SPORTS'
  | 'CULTURAL'
  | 'NETWORKING'
  | 'OTHER'

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'PENDING'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  bio?: string | null
  avatar?: string | null
  createdAt?: string
}

export interface EventItem {
  id: string
  title: string
  description: string
  category: EventCategory
  location: string
  startDateTime: string
  endDateTime: string
  registrationDeadline: string
  imageUrl?: string | null
  capacity: number
  organizerId: string
  isCancelled: boolean
  organizer?: Pick<User, 'id' | 'name' | 'email'>
}

export interface RegistrationItem {
  id: string
  userId: string
  eventId: string
  status: AttendanceStatus
  createdAt: string
  event?: EventItem
  user?: Pick<User, 'id' | 'name' | 'email'>
}
