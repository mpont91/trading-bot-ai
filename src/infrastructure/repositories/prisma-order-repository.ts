import { prisma } from '../db/prisma-client'
import { OrderRepository } from '../../application/repositories/order-repository'
import { Order, orderSchema } from '../../domain/types/order'

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
}
