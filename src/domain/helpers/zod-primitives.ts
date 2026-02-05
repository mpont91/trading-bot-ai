import { z } from 'zod'
import { Prisma } from '@prisma/client'

const rawDecimal = z
  .union([z.number(), z.string(), z.instanceof(Prisma.Decimal)])
  .transform((val) => Number(val))

export const zMoney = rawDecimal.pipe(z.number().positive())

export const zQuantity = rawDecimal.pipe(z.number().positive())

export const zFee = rawDecimal.pipe(z.number().nonnegative())
