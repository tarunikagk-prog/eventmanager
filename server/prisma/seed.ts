import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.notification.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  })

  const organizer = await prisma.user.create({
    data: {
      name: 'Organizer User',
      email: 'organizer@example.com',
      passwordHash: await bcrypt.hash('organizer123', 10),
      role: 'ORGANIZER',
    },
  })

  const attendee = await prisma.user.create({
    data: {
      name: 'Attendee User',
      email: 'attendee@example.com',
      passwordHash: await bcrypt.hash('attendee123', 10),
      role: 'ATTENDEE',
    },
  })

  const futureEvent = await prisma.event.create({
    data: {
      title: 'Tech Conference 2026',
      description: 'A leading conference for startup and product leaders.',
      category: 'CONFERENCE',
      location: 'New York',
      startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
      endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 13),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      capacity: 120,
      organizerId: organizer.id,
      imageUrl: 'https://images.unsplash.com/...',
    },
  })

  await prisma.registration.createMany({
    data: [
      { userId: attendee.id, eventId: futureEvent.id, status: 'PENDING' },
      { userId: admin.id, eventId: futureEvent.id, status: 'PRESENT' },
    ],
  })

  await prisma.notification.createMany({
    data: [
      { userId: admin.id, title: 'Welcome', message: 'Welcome to the admin dashboard.' },
      { userId: organizer.id, title: 'Your event is live', message: 'Your event has been published.' },
    ],
  })

  console.log({ admin: admin.email, organizer: organizer.email, attendee: attendee.email })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
