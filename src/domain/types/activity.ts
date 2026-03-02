import { z } from 'zod'
import { ActivityLevel } from '@prisma/client'

export { ActivityLevel }

export const activityLevelSchema = z.enum(ActivityLevel)

export const activitySchema = z.object({
  id: z.number().int().optional(),
  level: activityLevelSchema,
  context: z.string(),
  message: z.string(),
  createdAt: z.date().optional(),
})

export type Activity = z.infer<typeof activitySchema>

export function parseActivityLevel(value: string): ActivityLevel {
  switch (value) {
    case 'INFO':
      return ActivityLevel.INFO
    case 'WARN':
      return ActivityLevel.WARN
    case 'SUCCESS':
      return ActivityLevel.SUCCESS
    case 'ERROR':
      return ActivityLevel.ERROR
    default:
      throw new Error(`Invalid ActivityLevel: ${value}`)
  }
}
