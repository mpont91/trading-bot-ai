import { Container } from '../../di'
import { ExchangeService } from '../../domain/services/exchange-service'
import { Candle } from '../../domain/types/candle'
import { z } from 'zod'
import { AnalystService } from '../../domain/services/analyst-service'
import { Analysis } from '../../domain/types/analysis'
import { contextScript } from '../run'

const requestSchema = z.object({
  symbol: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest] = args

  const { symbol } = requestSchema.parse({
    symbol: symbolRequest,
  })

  const loggerService = Container.getLoggerService()
  const exchangeService: ExchangeService = Container.getExchangeService()
  const candles: Candle[] = await exchangeService.getCandles(symbol)

  const analystService: AnalystService = Container.getAnalystService()
  const response: Analysis = analystService.calculate(candles)

  loggerService.dump(contextScript, 'Analysis:', response)
}
