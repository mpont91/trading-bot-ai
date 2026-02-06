import { z } from 'zod'

export const metaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  lastPage: z.number().int().nonnegative(),
})

export type Paginated<T> = z.infer<typeof metaSchema> & {
  data: T[]
}
