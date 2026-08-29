import { describe, expect, it } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('Auth API', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})
