import { Order as PrismaOrder } from '@prisma/client'
import { Order, parseOrderSide } from '../../../domain/types/order'

export class OrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return {
      id: raw.id,
      exchangeOrderId: raw.exchangeOrderId,
      symbol: raw.symbol,
      side: parseOrderSide(raw.side),
      quantity: raw.quantity.toNumber(),
      price: raw.price.toNumber(),
      cost: raw.cost.toNumber(),
      fees: raw.fees.toNumber(),
      createdAt: raw.createdAt,
    }
  }
}
