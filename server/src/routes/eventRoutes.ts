import { Router } from 'express'
import { z } from 'zod'
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from '../controllers/eventController.js'
import { authorize, protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['CONFERENCE', 'WORKSHOP', 'SEMINAR', 'SPORTS', 'CULTURAL', 'NETWORKING', 'OTHER']),
  location: z.string().min(3),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  registrationDeadline: z.coerce.date(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  capacity: z.number().int().positive(),
})

router.get('/', protect, getEvents)
router.get('/:id', protect, getEventById)
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), validate(eventSchema), createEvent)
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), validate(eventSchema), updateEvent)
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteEvent)

export default router
