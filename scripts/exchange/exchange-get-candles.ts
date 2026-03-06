import { Container } from '../../src/di'
import { ExchangeService } from '../../src/domain/services/exchange-service'
import { Candle } from '../../src/domain/types/candle'
import { z } from 'zod'
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
  const response: Candle[] = await exchangeService.getCandles(symbol)

  loggerService.dump(contextScript, 'Candles:', response)
}
