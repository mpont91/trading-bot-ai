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
import { MaintenanceService } from './domain/services/maintenance-service'
import { ActivityRepository } from './application/repositories/activity-repository'
import { LoggerService } from './domain/services/logger-service'
import { PrismaActivityRepository } from './infrastructure/repositories/prisma-activity-repository'

export class Container {
  private static exchangeService?: ExchangeService
  private static analystService?: AnalystService
  private static advisorService?: AdvisorService
  private static tradingService?: TradingService
  private static portfolioService?: PortfolioService
  private static maintenanceService?: MaintenanceService
  private static loggerService?: LoggerService
  private static evaluationRepository?: EvaluationRepository
  private static orderRepository?: OrderRepository
  private static positionRepository?: PositionRepository
  private static performanceRepository?: PerformanceRepository
  private static activityRepository?: ActivityRepository
  private static manager?: Manager

  static getSettings() {
    return settings
  }

  static getExchangeService(): ExchangeService {
    if (!this.exchangeService) {
      const binanceSpot: BinanceSpot = new BinanceSpot(settings.binance)
      const exchange: Exchange = new BinanceClient(binanceSpot)
      this.exchangeService = new ExchangeService(
        this.getLoggerService(),
        exchange,
        settings.strategy,
      )
    }
    return this.exchangeService
  }
  static getAnalystService(): AnalystService {
    if (!this.analystService) {
      const analyst: Analyst = new TechnicalIndicators(
        settings.strategy.analyst,
      )
      this.analystService = new AnalystService(this.getLoggerService(), analyst)
    }
    return this.analystService
  }
  static getAdvisorService(): AdvisorService {
    if (!this.advisorService) {
      const advisor: Advisor = new GeminiClient(settings.gemini)
      this.advisorService = new AdvisorService(this.getLoggerService(), advisor)
    }
    return this.advisorService
  }

  static getTradingService(): TradingService {
    if (!this.tradingService) {
      this.tradingService = new TradingService(
        this.getLoggerService(),
        this.getExchangeService(),
        this.getOrderRepository(),
        this.getPositionRepository(),
        settings,
      )
    }
    return this.tradingService
  }

  static getPortfolioService(): PortfolioService {
    if (!this.portfolioService) {
      this.portfolioService = new PortfolioService(
        this.getLoggerService(),
        this.getExchangeService(),
        this.getTradingService(),
      )
    }
    return this.portfolioService
  }

  static getMaintenanceService(): MaintenanceService {
    if (!this.maintenanceService) {
      this.maintenanceService = new MaintenanceService(
        this.getLoggerService(),
        this.getExchangeService(),
        this.getActivityRepository(),
        settings.maintenance,
      )
    }
    return this.maintenanceService
  }

  static getLoggerService(): LoggerService {
    if (!this.loggerService) {
      this.loggerService = new LoggerService(this.getActivityRepository())
    }
    return this.loggerService
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

  static getActivityRepository(): ActivityRepository {
    if (!this.activityRepository) {
      this.activityRepository = new PrismaActivityRepository()
    }
    return this.activityRepository
  }

  static getManager(): Manager {
    if (!this.manager) {
      this.manager = new Manager(
        this.getLoggerService(),
        this.getAdvisorService(),
        this.getAnalystService(),
        this.getExchangeService(),
        this.getTradingService(),
        this.getMaintenanceService(),
        this.getEvaluationRepository(),
        this.getPositionRepository(),
        this.getSettings(),
      )
    }
    return this.manager
  }
}
