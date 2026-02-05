import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { z } from 'zod'
import { AnalystService } from '../../domain/services/analyst-service'
import { TechnicalAnalysis } from '../../domain/types/technical-analysis'
import { DecisionMakerService } from '../../domain/services/decision-maker-service'
import { DecisionContext, DecisionTrade } from '../../domain/types/decision'
import { DecisionRepository } from '../../application/repositories/decision-repository'
import { Settings } from '../../domain/types/settings'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const exchangeService: ExchangeService = Container.getExchangeService()
  const candles: Candle[] = await exchangeService.getCandles(symbol)
  const currentPrice = candles[candles.length - 1].closePrice

  const analystService: AnalystService = Container.getAnalystService()
  const technicalAnalysis: TechnicalAnalysis = analystService.calculate(candles)

  const decisionMakerService: DecisionMakerService =
    Container.getDecisionMakerService()
  const decisionTrade: DecisionTrade =
    await decisionMakerService.decide(technicalAnalysis)

  const decisionRepository: DecisionRepository =
    Container.getDecisionRepository()

  const settings: Settings = Container.getSettings()

  const decisionContext: DecisionContext = {
    symbol: symbol,
    timeFrame: settings.strategy.timeFrame,
    price: currentPrice,
    model: settings.gemini.modelName,
  }

  await decisionRepository.save(decisionContext, decisionTrade)
}
