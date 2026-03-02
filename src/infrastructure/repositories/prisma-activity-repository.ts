import { prisma } from '../db/prisma-client'
import { ActivityRepository } from '../../application/repositories/activity-repository'
import { Activity } from '../../domain/types/activity'
import { ActivityMapper } from './mappers/activity-mapper'

export class PrismaActivityRepository implements ActivityRepository {
  async save(activity: Activity): Promise<Activity> {
    const record = await prisma.activity.create({
      data: {
        level: activity.level,
        context: activity.context,
        message: activity.message,
      },
    })

    return ActivityMapper.toDomain(record)
  }
}
