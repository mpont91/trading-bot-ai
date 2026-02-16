import { prisma } from '../db/prisma-client'
import { OrderRepository } from '../../application/repositories/order-repository'
import { Order } from '../../domain/types/order'
import { OrderFilter } from '../../domain/filters/order-filter'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../domain/types/paginated'
import { OrderMapper } from './mappers/order-mapper'
import {
  buildPaginatedResponse,
  getDateRangeFilter,
  getPaginationParams,
} from './helpers/prisma-helper'

export class PrismaOrderRepository implements OrderRepository {
  async save(order: Order): Promise<Order> {
    const record = await prisma.order.create({
      data: {
        exchangeOrderId: order.exchangeOrderId,
        symbol: order.symbol,
        side: order.side,
        quantity: order.quantity,
        price: order.price,
        cost: order.cost,
        fees: order.fees,
      },
    })

    return OrderMapper.toDomain(record)
  }

  async findLast(symbol: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: { symbol },
      orderBy: { createdAt: 'desc' },
    })

    if (!order) return null

    return OrderMapper.toDomain(order)
  }

  async list(filters: OrderFilter): Promise<Paginated<Order>> {
    const { page, limit, startDate, endDate, symbol, side } = filters

    const where: Prisma.OrderWhereInput = {
      symbol: symbol ? { equals: symbol } : undefined,
      side: side ? { equals: side } : undefined,
      createdAt: getDateRangeFilter(startDate, endDate),
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPaginationParams(page, limit),
      }),
      prisma.order.count({ where }),
    ])

    return buildPaginatedResponse(
      data,
      total,
      page,
      limit,
      OrderMapper.toDomain,
    )
  }
}
