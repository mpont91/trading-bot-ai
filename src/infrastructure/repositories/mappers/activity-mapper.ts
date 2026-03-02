import { Activity as PrismaActivity } from '@prisma/client'
import { Activity, parseActivityLevel } from '../../../domain/types/activity'

export class ActivityMapper {
  static toDomain(raw: PrismaActivity): Activity {
    return {
      id: raw.id,
      level: parseActivityLevel(raw.level),
      context: raw.context,
      message: raw.message,
      createdAt: raw.createdAt,
    }
  }
}
