import { type Exchange } from '../../application/exchange'
import { type Coin } from '../types/coin'
import { Candle } from '../types/candle'
import { StrategySettings } from '../types/settings'

export class ExchangeService {
  constructor(
    private readonly api: Exchange,
    private readonly settings: StrategySettings,
  ) {}

  async getCoins(): Promise<Coin[]> {
    return this.api.getCoins()
  }

  async getPrice(symbol: string): Promise<number> {
    return this.api.getPrice(symbol)
  }

  async getCandles(symbol: string): Promise<Candle[]> {
    return this.api.getCandles(symbol, this.settings.timeFrame)
  }
}
