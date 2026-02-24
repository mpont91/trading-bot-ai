import { prisma } from '../db/prisma-client'
import { PositionRepository } from '../../application/repositories/position-repository'
import { Position, PositionStatus } from '../../domain/types/position'
import { PositionFilter } from '../../domain/filters/position-filter'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../domain/types/paginated'
import { PositionMapper } from './mappers/position-mapper'
import {
  buildPaginatedResponse,
  getDateRangeFilter,
  getPaginationParams,
} from './helpers/prisma-helper'

export class PrismaPositionRepository implements PositionRepository {
  async save(position: Position): Promise<Position> {
    let record
    if (position.id) {
      record = await prisma.position.update({
        where: { id: position.id },
        data: PositionMapper.toUpdateInput(position),
      })
      return PositionMapper.toDomain(record)
    } else {
      record = await prisma.position.create({
        data: PositionMapper.toCreateInput(position),
      })
    }

    return PositionMapper.toDomain(record)
  }

  async findOpen(symbol: string): Promise<Position | null> {
    const record = await prisma.position.findFirst({
      where: {
        symbol,
        status: PositionStatus.OPEN,
      },
      orderBy: { entryTime: 'desc' },
    })

    if (!record) return null

    return PositionMapper.toDomain(record)
  }

  async list(filters: PositionFilter): Promise<Paginated<Position>> {
    const { page, limit, startDate, endDate, symbol, status } = filters

    const where: Prisma.PositionWhereInput = {
      symbol: symbol ? { equals: symbol } : undefined,
      status: status ? { equals: status } : undefined,
      createdAt: getDateRangeFilter(startDate, endDate),
    }

    const [data, total] = await Promise.all([
      prisma.position.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPaginationParams(page, limit),
      }),
      prisma.position.count({ where }),
    ])

    return buildPaginatedResponse(
      data,
      total,
      page,
      limit,
      PositionMapper.toDomain,
    )
  }

  async countOpen(): Promise<number> {
    return prisma.position.count({
      where: {
        status: PositionStatus.OPEN,
      },
    })
  }
}
