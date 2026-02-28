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
import { TradingService } from './domain/services/trading-service'
import { PositionRepository } from './application/repositories/position-repository'
import { PrismaPositionRepository } from './infrastructure/repositories/prisma-position-repository'
import { PerformanceRepository } from './application/repositories/performance-repository'
import { PrismaPerformanceRepository } from './infrastructure/repositories/prisma-performance-respository'
import { PortfolioService } from './domain/services/portfolio-service'
import { PortfolioRepository } from './application/repositories/portfolio-repository'
import { PrismaPortfolioRepository } from './infrastructure/repositories/prisma-portfolio-repository'

export class Container {
  private static exchangeService?: ExchangeService
  private static analystService?: AnalystService
  private static advisorService?: AdvisorService
  private static tradingService?: TradingService
  private static portfolioService?: PortfolioService
  private static evaluationRepository?: EvaluationRepository
  private static orderRepository?: OrderRepository
  private static positionRepository?: PositionRepository
  private static performanceRepository?: PerformanceRepository
  private static portfolioRepository?: PortfolioRepository
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

  static getTradingService(): TradingService {
    if (!this.tradingService) {
      const exchangeService = this.getExchangeService()
      const orderRepository = this.getOrderRepository()
      const positionRepository = this.getPositionRepository()
      this.tradingService = new TradingService(
        exchangeService,
        orderRepository,
        positionRepository,
        settings,
      )
    }
    return this.tradingService
  }

  static getPortfolioService(): PortfolioService {
    if (!this.portfolioService) {
      const exchangeService = this.getExchangeService()
      const tradingService = this.getTradingService()
      const portfolioRepository = this.getPortfolioRepository()
      this.portfolioService = new PortfolioService(
        exchangeService,
        tradingService,
        portfolioRepository,
      )
    }
    return this.portfolioService
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

  static getPositionRepository(): PositionRepository {
    if (!this.positionRepository) {
      this.positionRepository = new PrismaPositionRepository()
    }
    return this.positionRepository
  }

  static getPerformanceRepository(): PerformanceRepository {
    if (!this.performanceRepository) {
      this.performanceRepository = new PrismaPerformanceRepository()
    }
    return this.performanceRepository
  }

  static getPortfolioRepository(): PortfolioRepository {
    if (!this.portfolioRepository) {
      this.portfolioRepository = new PrismaPortfolioRepository()
    }
    return this.portfolioRepository
  }

  static getManager(): Manager {
    if (!this.manager) {
      this.manager = new Manager(
        this.getAdvisorService(),
        this.getAnalystService(),
        this.getExchangeService(),
        this.getTradingService(),
        this.getEvaluationRepository(),
        this.getPositionRepository(),
        this.getSettings(),
      )
    }
    return this.manager
  }
}
