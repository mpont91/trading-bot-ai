import { type Exchange } from './application/exchange'
import { BinanceClient } from './infrastructure/exchange/binance-client'
import { ExchangeService } from './domain/services/exchange-service'
import { settings } from './application/settings'
import { BinanceSpot } from './infrastructure/exchange/binance-spot'
import { type DecisionMaker } from './application/decision-maker'
import { GeminiClient } from './infrastructure/decision-maker/gemini-client'
import { DecisionMakerService } from './domain/services/decision-maker-service'
import { AnalystService } from './domain/services/analyst-service'
import { Analyst } from './application/analyst'
import { TechnicalIndicators } from './infrastructure/analyst/technical-indicators'
import { DecisionRepository } from './application/repositories/decision-repository'
import { PrismaDecisionRepository } from './infrastructure/repositories/prisma-decision-repository'

export class Container {
  private static exchangeService?: ExchangeService
  private static analystService?: AnalystService
  private static decisionMakerService?: DecisionMakerService
  private static decisionRepository?: DecisionRepository

  static getSettings() {
    return settings
  }

  static getExchangeService(): ExchangeService {
    if (!this.exchangeService) {
      const binanceSpot: BinanceSpot = new BinanceSpot(settings.binance)
      const exchange: Exchange = new BinanceClient(binanceSpot)
      this.exchangeService = new ExchangeService(exchange, settings.strategy)
    }
    return this.exchangeService
  }
  static getAnalystService(): AnalystService {
    if (!this.analystService) {
      const analyst: Analyst = new TechnicalIndicators(
        settings.strategy.technical,
      )
      this.analystService = new AnalystService(analyst)
    }
    return this.analystService
  }
  static getDecisionMakerService(): DecisionMakerService {
    if (!this.decisionMakerService) {
      const decisionMaker: DecisionMaker = new GeminiClient(settings.gemini)
      this.decisionMakerService = new DecisionMakerService(decisionMaker)
    }
    return this.decisionMakerService
  }

  static getDecisionRepository(): DecisionRepository {
    if (!this.decisionRepository) {
      this.decisionRepository = new PrismaDecisionRepository()
    }
    return this.decisionRepository
  }
}
