import { type Exchange } from './application/exchange'
import { BinanceClient } from './infrastructure/exchange/binance-client'
import { ExchangeService } from './domain/services/exchange-service'
import { settings } from './application/settings'
import { BinanceSpot } from './infrastructure/exchange/binance-spot'
import { type Advisor } from './application/advisor'
import { GeminiClient } from './infrastructure/advisor/gemini-client'
import { AdvisorService } from './domain/services/advisor-service'
import { AnalystService } from './domain/services/analyst-service'
import { Analyst } from './application/analyst'
import { TechnicalIndicators } from './infrastructure/analyst/technical-indicators'
import { EvaluationRepository } from './application/repositories/evaluation-repository'
import { PrismaEvaluationRepository } from './infrastructure/repositories/prisma-evaluation-repository'
import { OrderRepository } from './application/repositories/order-repository'
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order-repository'
import { Manager } from './application/manager'

export class Container {
  private static exchangeService?: ExchangeService
  private static analystService?: AnalystService
  private static advisorService?: AdvisorService
  private static evaluationRepository?: EvaluationRepository
  private static orderRepository?: OrderRepository
  private static manager?: Manager

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
        settings.strategy.analyst,
      )
      this.analystService = new AnalystService(analyst)
    }
    return this.analystService
  }
  static getAdvisorService(): AdvisorService {
    if (!this.advisorService) {
      const advisor: Advisor = new GeminiClient(settings.gemini)
      this.advisorService = new AdvisorService(advisor)
    }
    return this.advisorService
  }

  static getEvaluationRepository(): EvaluationRepository {
    if (!this.evaluationRepository) {
      this.evaluationRepository = new PrismaEvaluationRepository()
    }
    return this.evaluationRepository
  }

  static getOrderRepository(): OrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new PrismaOrderRepository()
    }
    return this.orderRepository
  }

  static getManager(): Manager {
    if (!this.manager) {
      this.manager = new Manager(
        this.getAdvisorService(),
        this.getAnalystService(),
        this.getExchangeService(),
        this.getEvaluationRepository(),
        this.getOrderRepository(),
        this.getSettings(),
      )
    }
    return this.manager
  }
}
