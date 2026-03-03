import { prisma } from '../db/prisma-client'
import { Prisma } from '@prisma/client'
import { ActivityRepository } from '../../application/repositories/activity-repository'
import { Activity } from '../../domain/types/activity'
import { ActivityMapper } from './mappers/activity-mapper'
import { ActivityFilter } from '../../domain/filters/activity-filter'
import { Paginated } from '../../domain/types/paginated'
import {
  buildPaginatedResponse,
  getDateRangeFilter,
  getPaginationParams,
} from './helpers/prisma-helper'

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

  async list(filters: ActivityFilter): Promise<Paginated<Activity>> {
    const { page, limit, startDate, endDate } = filters

    const where: Prisma.ActivityWhereInput = {
      createdAt: getDateRangeFilter(startDate, endDate),
    }

    const [data, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPaginationParams(page, limit),
      }),
      prisma.activity.count({ where }),
    ])

    return buildPaginatedResponse(
      data,
      total,
      page,
      limit,
      ActivityMapper.toDomain,
    )
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const result = await prisma.activity.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    })

    return result.count
  }
}
