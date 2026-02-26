import type { RestTradeTypes } from '@binance/connector-typescript'
import { Order, OrderSide } from '../../../domain/types/order'
import { mapBinanceToDomainSide } from './side-mapper'

interface FeeItem {
  commission?: string
  commissionAsset?: string
  price?: string
}

function calculateUsdcFees(
  items: FeeItem[],
  baseAsset: string,
  bnbPriceInUsdc: number,
): number {
  return items.reduce((acc, item) => {
    const commission = parseFloat(item.commission || '0')
    const asset = item.commissionAsset
    const price = parseFloat(item.price || '0')

    if (!commission) return acc

    if (asset === 'USDC') {
      return acc + commission
    } else if (asset === 'BNB') {
      return acc + commission * bnbPriceInUsdc
    } else if (asset === baseAsset) {
      return acc + commission * price
    } else {
      console.warn(`[Mapper] Unknown commission asset: ${asset}`)
      return acc
    }
  }, 0)
}

export function mapBinanceToDomainOrder(
  response: RestTradeTypes.newOrderResponse,
  bnbPriceInUsdc: number = 0,
): Order {
  if (!response.side) throw new Error('Binance Order response missing "side"')
  if (!response.symbol)
    throw new Error('Binance Order response missing "symbol"')

  const cost = parseFloat(response.cummulativeQuoteQty || '0')
  const quantity = parseFloat(response.executedQty || '0')
  const price = quantity > 0 ? cost / quantity : 0
  const baseAsset = response.symbol.replace('USDC', '')

  const fees = calculateUsdcFees(
    response.fills || [],
    baseAsset,
    bnbPriceInUsdc,
  )

  return {
    exchangeOrderId: response.orderId.toString(),
    symbol: response.symbol,
    side: mapBinanceToDomainSide(response.side),
    quantity,
    price,
    cost,
    fees,
  }
}

export function mapBinanceTradesToDomainOrder(
  trades: RestTradeTypes.accountTradeListResponse[],
  symbol: string,
  orderId: string,
  bnbPriceInUsdc: number = 0,
): Order {
  if (trades.length === 0) {
    throw new Error(`Cannot map empty trades to Order for ${symbol}`)
  }

  let quantity = 0
  let cost = 0
  const baseAsset = symbol.replace('USDC', '')
  const side = trades[0].isBuyer ? OrderSide.BUY : OrderSide.SELL

  for (const trade of trades) {
    quantity += parseFloat(trade.qty || '0')
    cost += parseFloat(trade.quoteQty || '0')
  }

  const price = quantity > 0 ? cost / quantity : 0

  const fees = calculateUsdcFees(trades, baseAsset, bnbPriceInUsdc)

  return {
    exchangeOrderId: orderId.toString(),
    symbol,
    side,
    quantity,
    price,
    cost,
    fees,
  }
}
