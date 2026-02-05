import type { RestTradeTypes } from '@binance/connector-typescript'
import { Order } from '../../../domain/types/order'
import { mapBinanceToDomainSide } from './side-mapper'

export function mapBinanceToDomainOrder(
  response: RestTradeTypes.newOrderResponse,
): Order {
  if (!response.side) throw new Error('Binance Order response missing "side"')
  if (!response.symbol)
    throw new Error('Binance Order response missing "symbol"')

  const cost = parseFloat(response.cummulativeQuoteQty || '0')
  const quantity = parseFloat(response.executedQty || '0')
  const price = quantity > 0 ? cost / quantity : 0

  const fills = response.fills || []
  const fees = fills.reduce((acc: number, fill: RestTradeTypes.fill) => {
    return acc + parseFloat(fill.commission || '0')
  }, 0)

  return {
    exchangeOrderId: response.orderId.toString(),
    symbol: response.symbol,
    side: mapBinanceToDomainSide(response.side),
    quantity: quantity,
    price: price,
    cost: cost,
    fees: fees,
  }
}
