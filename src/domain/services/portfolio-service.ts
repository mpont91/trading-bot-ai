import { ExchangeService } from './exchange-service'
import { TradingService } from './trading-service'
import { Portfolio } from '../types/portfolio'

export class PortfolioService {
  private portfolio: Portfolio | null = null
  private lastFetchTime: number = 0
  private readonly CACHE_TTL_MS = 5 * 60 * 1000 // 5 min cache

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly tradingService: TradingService,
  ) {}

  async getPortfolio(): Promise<Portfolio> {
    const now = Date.now()

    if (this.portfolio && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      return this.portfolio
    }

    try {
      const equity = await this.tradingService.getEquity()
      const bnb = await this.exchangeService.getBalance('BNB')

      this.portfolio = {
        equity,
        bnb,
        timestamp: new Date(),
      }
      this.lastFetchTime = now

      return this.portfolio
    } catch (error) {
      console.error(
        '[Portfolio-Service] Error fetching portfolio from exchange:',
        error,
      )

      if (this.portfolio) {
        return this.portfolio
      }
      throw error
    }
  }
}
