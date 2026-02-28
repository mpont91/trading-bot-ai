import { ExchangeService } from './exchange-service'
import { TradingService } from './trading-service'
import { PortfolioRepository } from '../../application/repositories/portfolio-repository'
import { Portfolio } from '../types/portfolio'

export class PortfolioService {
  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly tradingService: TradingService,
    private readonly portfolioRepository: PortfolioRepository,
  ) {}

  async record(): Promise<Portfolio> {
    const equity = await this.tradingService.getEquity()
    const bnb = await this.exchangeService.getBalance('BNB')
    return this.portfolioRepository.save({
      equity,
      bnb,
    })
  }

  async getLatest(): Promise<Portfolio | null> {
    return this.portfolioRepository.getLatest()
  }
}
