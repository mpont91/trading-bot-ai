import { prisma } from '../db/prisma-client'
import { PositionRepository } from '../../application/repositories/position-repository'
import { Position, PositionStatus } from '../../domain/types/position'
import { PositionFilter } from '../../domain/filters/position-filter'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../domain/types/paginated'
import { PositionMapper } from './mappers/position-mapper'

export class PrismaPositionRepository implements PositionRepository {
  async save(position: Position): Promise<Position> {
    if (position.id) {
      const record = await prisma.position.update({
        where: { id: position.id },
        data: {
          status: position.status,
          exitPrice: position.exitPrice,
          exitTime: position.exitTime,
          sellOrderId: position.sellOrderId,
          pnl: position.pnl,
          pnlPercent: position.pnlPercent,
        },
      })
      return PositionMapper.toDomain(record)
    }

    const record = await prisma.position.create({
      data: {
        symbol: position.symbol,
        status: position.status,
        entryPrice: position.entryPrice,
        quantity: position.quantity,
        entryTime: position.entryTime,
        buyOrderId: position.buyOrderId,
      },
    })

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

    const where: Prisma.PositionWhereInput = {}

    if (symbol) where.symbol = { contains: symbol }
    if (status) where.status = status

    if (startDate || endDate) {
      where.entryTime = {}
      if (startDate) where.entryTime.gte = new Date(startDate)
      if (endDate) {
        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)
        where.entryTime.lte = endOfDay
      }
    }

    const [data, total] = await Promise.all([
      prisma.position.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { entryTime: 'desc' },
      }),
      prisma.position.count({ where }),
    ])

    return {
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
      data: data.map(PositionMapper.toDomain),
    }
  }
}
