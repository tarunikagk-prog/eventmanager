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

export const getEvents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, search, upcomingOnly } = req.query
    const filters: any = {
      isCancelled: false,
    }

    if (category && category !== 'ALL') {
      filters.category = category
    }

    if (search) {
      filters.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { location: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    if (upcomingOnly === 'true') {
      filters.startDateTime = { gte: new Date() }
    }

    const events = await prisma.event.findMany({
      where: filters,
      include: { organizer: { select: { id: true, name: true, email: true } } },
      orderBy: { startDateTime: 'asc' },
    })

    res.json({ success: true, events })
  } catch (error) {
    next(error)
  }
}

export const getEventById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = getRouteParamId(req.params.id)
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        registrations: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    })

    if (!event) {
      throw new AppError('Event not found.', 404)
    }

    res.json({ success: true, event })
  } catch (error) {
    next(error)
  }
}

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizerId = req.user?.userId
    const event = await prisma.event.create({
      data: {
        ...req.body,
        organizerId,
      },
    })

    res.status(201).json({ success: true, event })
  } catch (error) {
    next(error)
  }
}

export const updateEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getRouteParamId(req.params.id)
    const event = await prisma.event.findUnique({ where: { id } })

    if (!event) {
      throw new AppError('Event not found.', 404)
    }

    if (event.organizerId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      throw new AppError('You can only edit your own event.', 403)
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: req.body,
    })

    res.json({ success: true, event: updatedEvent })
  } catch (error) {
    next(error)
  }
}

export const deleteEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getRouteParamId(req.params.id)
    const event = await prisma.event.findUnique({ where: { id } })

    if (!event) {
      throw new AppError('Event not found.', 404)
    }

    if (event.organizerId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      throw new AppError('You cannot delete this event.', 403)
    }

    await prisma.event.delete({ where: { id } })
    res.json({ success: true, message: 'Event deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
