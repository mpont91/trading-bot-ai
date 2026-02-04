import { type Exchange } from './application/exchange'
import { BinanceClient } from './infrastructure/exchange/binance-client'
import { ExchangeService } from './domain/services/exchange-service'
import { settings } from './application/settings'
import { BinanceSpot } from './infrastructure/exchange/binance-spot'
import { type Ai } from './application/ai'
import { GeminiClient } from './infrastructure/ai/gemini-client'
import { AiService } from './domain/services/ai-service'
import { TechnicalService } from './domain/services/technical-service'
import { Technical } from './application/technical'
import { TechnicalIndicators } from './infrastructure/technical/technical-indicators'

class Container {
  private static exchangeService: ExchangeService
  private static technicalService: TechnicalService
  private static aiService: AiService

  static initialize(): void {
    const spot: BinanceSpot = new BinanceSpot(settings.binance)
    const exchange: Exchange = new BinanceClient(spot)
    const technical: Technical = new TechnicalIndicators(
      settings.strategy.technical,
    )
    const ai: Ai = new GeminiClient(settings.gemini)

    this.exchangeService = new ExchangeService(exchange, settings.strategy)
    this.technicalService = new TechnicalService(technical)
    this.aiService = new AiService(ai)
  }

  static getExchangeService(): ExchangeService {
    return this.exchangeService
  }
  static getTechnicalService(): TechnicalService {
    return this.technicalService
  }
  static getAiService(): AiService {
    return this.aiService
  }
}

Container.initialize()
export { Container }
