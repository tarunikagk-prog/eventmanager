import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const validate = (schema: z.ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
