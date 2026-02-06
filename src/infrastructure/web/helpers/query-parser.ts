import { Request } from 'express'
import { z } from 'zod'

export const parseQuery = <T>(req: Request, schema: z.ZodType<T>): T => {
  const result = schema.safeParse(req.query)

  if (result.success) {
    return result.data
  }

  const messages = result.error.issues.map((issue) => {
    const path = issue.path.join('.') || 'param'
    return `${path}: ${issue.message}`
  })

  throw new Error(`Invalid Query Params: ${messages.join(' | ')}`)
}
