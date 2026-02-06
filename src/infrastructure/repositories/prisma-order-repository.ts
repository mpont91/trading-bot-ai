import { prisma } from '../db/prisma-client'
import { OrderRepository } from '../../application/repositories/order-repository'
import { Order, orderSchema } from '../../domain/types/order'
import { OrderFilter } from '../../domain/filters/order-filter'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../domain/types/paginated'
import { OrderMapper } from './mappers/order-mapper'

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

    return orderSchema.parse(record)
  }

  async findLast(symbol: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: { symbol },
      orderBy: { createdAt: 'desc' },
    })

    if (!order) return null

    return orderSchema.parse(order)
  }

  async list(filters: OrderFilter): Promise<Paginated<Order>> {
    const { page, limit, startDate, endDate, symbol, side } = filters

    const where: Prisma.OrderWhereInput = {}

    if (symbol) where.symbol = { contains: symbol }
    if (side) where.side = side

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return {
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
      data: data.map(OrderMapper.toDomain),
    }
  }
}
