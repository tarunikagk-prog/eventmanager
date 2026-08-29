import { Router } from 'express'
import { z } from 'zod'
import { cancelRegistration, getEventRegistrations, getMyRegistrations, registerForEvent, updateAttendance } from '../controllers/registrationController.js'
import { authorize, protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post('/event/:eventId', protect, authorize('ATTENDEE', 'ORGANIZER', 'ADMIN'), registerForEvent)
router.delete('/:registrationId', protect, cancelRegistration)
router.get('/me', protect, getMyRegistrations)
router.get('/event/:eventId', protect, authorize('ORGANIZER', 'ADMIN'), getEventRegistrations)
router.patch('/:registrationId/attendance', protect, authorize('ORGANIZER', 'ADMIN'), validate(z.object({ status: z.enum(['PRESENT', 'ABSENT', 'PENDING']) })), updateAttendance)

export default router
