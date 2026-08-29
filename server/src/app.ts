import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import registrationRoutes from './routes/registrationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Event Management API is running.' })
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/events', eventRoutes)
app.use('/registrations', registrationRoutes)
app.use('/dashboard', dashboardRoutes)

app.use(errorHandler)

export default app
