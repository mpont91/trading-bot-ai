import { ExchangeService } from './exchange-service'
import { TradingService } from './trading-service'
import { Portfolio } from '../types/portfolio'
import { LoggerService } from './logger-service'

export class PortfolioService {
  private readonly context = '🏦  Portfolio-Service'
  private portfolio: Portfolio | null = null
  private lastFetchTime: number = 0
  private readonly CACHE_TTL_MS = 5 * 60 * 1000 // 5 min cache

  constructor(
    private readonly loggerService: LoggerService,
    private readonly exchangeService: ExchangeService,
    private readonly tradingService: TradingService,
  ) {}

  async getPortfolio(): Promise<Portfolio> {
    const now = Date.now()

    if (this.portfolio && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      this.loggerService.debug(
        this.context,
        'Returning portfolio data from cache.',
      )
      return this.portfolio
    }

    try {
      this.loggerService.debug(
        this.context,
        'Cache expired or missing. Fetching fresh portfolio data...',
      )

      const equity = await this.tradingService.getEquity()
      const bnb = await this.exchangeService.getBalance('BNB')

      this.portfolio = {
        equity,
        bnb,
        timestamp: new Date(),
      }
      this.lastFetchTime = now

      this.loggerService.debug(this.context, 'Portfolio updated successfully.')

      return this.portfolio
    } catch (error) {
      if (this.portfolio) {
        this.loggerService.warn(
          this.context,
          'Binance API failed. Falling back to stale portfolio data.',
        )
        return this.portfolio
      }

      this.loggerService.error(
        this.context,
        'Critical failure fetching portfolio and no cache available.',
        error,
      )
      throw error
    }
  }
}
