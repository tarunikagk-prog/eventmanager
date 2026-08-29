import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../lib/errors.js'
import { verifyToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: 'ADMIN' | 'ORGANIZER' | 'ATTENDEE'
  }
}

export const protect = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token missing.', 401)
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    })

    if (!user) {
      throw new AppError('User not found.', 401)
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const authorize = (...roles: Array<'ADMIN' | 'ORGANIZER' | 'ATTENDEE'>) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authorized to perform this action.', 403))
    }

    return next()
  }
