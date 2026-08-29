import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'ORGANIZER', 'ATTENDEE']).default('ATTENDEE'),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', protect, me)

export default router
