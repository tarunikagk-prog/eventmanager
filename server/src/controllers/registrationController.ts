import type { NextFunction, Response } from 'express'
import { AppError } from '../lib/errors.js'
import { prisma } from '../lib/prisma.js'
import type { AuthenticatedRequest } from '../middleware/auth.js'

const getRouteParamId = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  if (!value) {
    throw new AppError('Missing resource id.', 400)
  }

  return value
}

export const registerForEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId
    const eventId = getRouteParamId(req.params.eventId)

    if (!userId) {
      throw new AppError('Authentication required.', 401)
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    })

    if (!event) {
      throw new AppError('Event not found.', 404)
    }

    if (event.isCancelled) {
      throw new AppError('This event has been cancelled.', 400)
    }

    if (new Date(event.registrationDeadline) < new Date()) {
      throw new AppError('Registration deadline has passed.', 400)
    }

    const existingRegistration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    })

    if (existingRegistration) {
      throw new AppError('You are already registered for this event.', 409)
    }

    const registrationCount = await prisma.registration.count({ where: { eventId } })
    if (registrationCount >= event.capacity) {
      throw new AppError('This event is full.', 400)
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
      },
      include: { event: true },
    })

    res.status(201).json({ success: true, registration })
  } catch (error) {
    next(error)
  }
}

export const cancelRegistration = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId
    const registrationId = getRouteParamId(req.params.registrationId)

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    })

    if (!registration) {
      throw new AppError('Registration not found.', 404)
    }

    if (registration.userId !== userId && req.user?.role !== 'ADMIN') {
      throw new AppError('You cannot cancel this registration.', 403)
    }

    await prisma.registration.delete({ where: { id: registrationId } })
    res.json({ success: true, message: 'Registration cancelled successfully.' })
  } catch (error) {
    next(error)
  }
}

export const getMyRegistrations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.user?.userId },
      include: {
        event: {
          include: { organizer: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, registrations })
  } catch (error) {
    next(error)
  }
}

export const getEventRegistrations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = getRouteParamId(req.params.eventId)
    const event = await prisma.event.findUnique({ where: { id: eventId } })

    if (!event) {
      throw new AppError('Event not found.', 404)
    }

    if (event.organizerId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      throw new AppError('You are not authorized to view this attendee list.', 403)
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, registrations })
  } catch (error) {
    next(error)
  }
}

export const updateAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrationId = getRouteParamId(req.params.registrationId)
    const { status } = req.body
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true },
    })

    if (!registration) {
      throw new AppError('Registration not found.', 404)
    }

    if (registration.event.organizerId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      throw new AppError('You are not authorized to update attendance.', 403)
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: { status: String(status) as 'PRESENT' | 'ABSENT' | 'PENDING' },
    })

    res.json({ success: true, registration: updatedRegistration })
  } catch (error) {
    next(error)
  }
}
