import type { NextFunction, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import type { AuthenticatedRequest } from '../middleware/auth.js'

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const now = new Date()

    const [totalEvents, upcomingEvents, completedEvents, totalRegistrations, totalAttendees, totalUsers, userEvents] = await Promise.all([
      prisma.event.count({ where: { isCancelled: false } }),
      prisma.event.count({ where: { isCancelled: false, startDateTime: { gte: now } } }),
      prisma.event.count({ where: { isCancelled: false, endDateTime: { lt: now } } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: 'PRESENT' } }),
      prisma.user.count(),
      prisma.event.findMany({
        where: { organizerId: req.user?.userId },
        include: { registrations: true },
      }),
    ])

    const organizerMetrics: {
      totalEvents: number
      upcomingEvents: number
      completedEvents: number
      totalRegistrations: number
      totalAttendees: number
      totalCapacity: number
    } = {
      totalEvents: userEvents.length,
      upcomingEvents: userEvents.filter((event: { startDateTime: Date }) => event.startDateTime >= now).length,
      completedEvents: userEvents.filter((event: { endDateTime: Date }) => event.endDateTime < now).length,
      totalRegistrations: userEvents.reduce((sum: number, event: { registrations: Array<{ id: string }> }) => sum + event.registrations.length, 0),
      totalAttendees: userEvents.reduce((sum: number, event: { registrations: Array<{ status: string }> }) => sum + event.registrations.filter((r: { status: string }) => r.status === 'PRESENT').length, 0),
      totalCapacity: userEvents.reduce((sum: number, event: { capacity: number }) => sum + event.capacity, 0),
    }

    const isAdmin = req.user?.role === 'ADMIN'

    res.json({
      success: true,
      stats: isAdmin
        ? {
            totalEvents,
            upcomingEvents,
            completedEvents,
            totalRegistrations,
            totalAttendees,
            totalUsers,
          }
        : organizerMetrics,
    })
  } catch (error) {
    next(error)
  }
}
