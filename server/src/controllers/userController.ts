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

export const getUsers = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, users })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getRouteParamId(req.params.userId)
    const { role } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AppError('Authentication required.', 401)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: req.body.name,
        bio: req.body.bio,
        avatar: req.body.avatar,
      },
      select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
    })

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}
