import { type Coin } from '../domain/types/coin'
import { TimeFrame } from '../domain/types/time-frame'
import { Candle } from '../domain/types/candle'
import { Order, OrderRequest } from '../domain/types/order'

export interface Exchange {
  getCoins(): Promise<Coin[]>
  getPrice(symbol: string): Promise<number>
  getCandles(symbol: string, timeFrame: TimeFrame): Promise<Candle[]>
  submitOrder(orderRequest: OrderRequest): Promise<Order>
}
