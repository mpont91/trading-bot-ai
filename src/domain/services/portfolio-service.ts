import { ExchangeService } from './exchange-service'
import { Portfolio } from '../types/portfolio'
import { LoggerService } from './logger-service'
import { Coin } from '../types/coin'
import { StrategySettings } from '../types/settings'

export class PortfolioService {
  private readonly context = '🏦  Portfolio-Service'
  private portfolio: Portfolio | null = null
  private lastFetchTime: number = 0
  private readonly CACHE_TTL_MS = 5 * 60 * 1000 // 5 min cache

  constructor(
    private readonly loggerService: LoggerService,
    private readonly exchangeService: ExchangeService,
    private readonly settings: StrategySettings,
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
        'Cache expired. Calculating portfolio...',
      )

      const coins: Coin[] = await this.exchangeService.getCoins()

      this.portfolio = await this.calculatePortfolio(coins)

      this.lastFetchTime = now

      this.loggerService.debug(
        this.context,
        'Portfolio valuation updated successfully.',
      )
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

  private async calculatePortfolio(coins: Coin[]): Promise<Portfolio> {
    const strategyCoins = new Set(
      this.settings.symbols.map((s) => s.replace('USDC', '')),
    )

    strategyCoins.add('USDC')

    let totalEquity = 0
    let tradingEquity = 0
    let bnbQuantity = 0

    for (const coin of coins) {
      if (coin.name === 'BNB') {
        bnbQuantity = coin.quantity
      }

      let coinEquity = 0

      if (coin.name === 'USDC') {
        coinEquity = coin.quantity
      } else {
        const currentPrice = await this.exchangeService.getPrice(
          `${coin.name}USDC`,
        )
        coinEquity = coin.quantity * currentPrice
      }

      totalEquity += coinEquity

      if (strategyCoins.has(coin.name)) {
        tradingEquity += coinEquity
      }
    }

    return {
      totalEquity: totalEquity,
      tradingEquity: tradingEquity,
      bnb: bnbQuantity,
      timestamp: new Date(),
    }
  }
}
