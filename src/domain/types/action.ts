import { Action } from '@prisma/client'
import { z } from 'zod'

export { Action } from '@prisma/client'

export const actionSchema = z.enum(Action)
