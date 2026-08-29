import bcrypt from 'bcryptjs'
import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors.js'
import { signToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new AppError('User with this email already exists.', 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new AppError('Invalid email or password.', 401)
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw new AppError('Invalid email or password.', 401)
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const me = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?.userId
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new AppError('User not found.', 404)
    }

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}
