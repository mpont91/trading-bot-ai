import { Position as PrismaPosition } from '@prisma/client'
import { Position, PositionStatus } from '../../../domain/types/position'

export class PositionMapper {
  static toDomain(raw: PrismaPosition): Position {
    return {
      id: raw.id,
      symbol: raw.symbol,
      status: raw.status as PositionStatus,
      quantity: raw.quantity.toNumber(),
      entryPrice: raw.entryPrice.toNumber(),
      entryTime: raw.entryTime,
      exitPrice: raw.exitPrice ? raw.exitPrice.toNumber() : null,
      exitTime: raw.exitTime,
      buyOrderId: raw.buyOrderId,
      sellOrderId: raw.sellOrderId,
      pnl: raw.pnl ? raw.pnl.toNumber() : null,
      pnlPercent: raw.pnlPercent ? raw.pnlPercent.toNumber() : null,
      currentPrice: undefined,
    }
  }
}
