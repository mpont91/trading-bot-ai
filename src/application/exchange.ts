import { type Coin } from '../domain/types/coin'
import { TimeFrame } from '../domain/types/time-frame'
import { Candle } from '../domain/types/candle'

export interface Exchange {
  getCoins(): Promise<Coin[]>
  getPrice(symbol: string): Promise<number>
  getCandles(symbol: string, timeFrame: TimeFrame): Promise<Candle[]>
}
