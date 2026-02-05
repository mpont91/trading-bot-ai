import { OrderSide } from '../../../domain/types/order'
import { Side } from '@binance/connector-typescript'

export function mapDomainToBinanceSide(side: OrderSide): Side {
  switch (side) {
    case OrderSide.BUY:
      return Side.BUY
    case OrderSide.SELL:
      return Side.SELL
    default:
      throw new Error('Invalid side: ' + side)
  }
}

export function mapBinanceToDomainSide(binanceSide: Side | ''): OrderSide {
  switch (binanceSide) {
    case Side.BUY:
      return OrderSide.BUY
    case Side.SELL:
      return OrderSide.SELL
    default:
      throw new Error('Invalid side: ' + binanceSide)
  }
}
