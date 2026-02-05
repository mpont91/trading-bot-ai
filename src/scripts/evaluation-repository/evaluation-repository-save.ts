import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { z } from 'zod'
import { AnalystService } from '../../domain/services/analyst-service'
import { Analysis } from '../../domain/types/analysis'
import { AdvisorService } from '../../domain/services/advisor-service'
import { AdviceRepository } from '../../application/repositories/advice-repository'
import { Settings } from '../../domain/types/settings'
import { Advice } from '../../domain/types/advice'
import { Evaluation } from '../../domain/types/evaluation'

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
  const analysis: Analysis = analystService.calculate(candles)

  const advisorService: AdvisorService = Container.getAdvisorService()
  const advice: Advice = await advisorService.advice(analysis)

  const adviceRepository: AdviceRepository = Container.getAdviceRepository()

  const settings: Settings = Container.getSettings()

  const evaluation: Evaluation = {
    ...advice,
    symbol: symbol,
    timeFrame: settings.strategy.timeFrame,
    price: currentPrice,
    model: settings.gemini.modelName,
  }

  await adviceRepository.save(evaluation)
}
