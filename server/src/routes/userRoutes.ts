import { Router } from 'express'
import { getUsers, updateProfile, updateUserRole } from '../controllers/userController.js'
import { authorize, protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { z } from 'zod'

const router = Router()

router.get('/', protect, authorize('ADMIN'), getUsers)
router.patch('/role/:userId', protect, authorize('ADMIN'), validate(z.object({ role: z.enum(['ADMIN', 'ORGANIZER', 'ATTENDEE']) })), updateUserRole)
router.patch('/profile', protect, validate(z.object({ name: z.string().min(2).optional(), bio: z.string().max(500).optional(), avatar: z.string().url().optional() })), updateProfile)

export default router
