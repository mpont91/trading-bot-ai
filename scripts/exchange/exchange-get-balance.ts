import { Container } from '../../src/di'
import { ExchangeService } from '../../src/domain/services/exchange-service'
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
  const response: number = await exchangeService.getBalance(symbol)

  loggerService.debug(contextScript, `Balance: ${response} ${symbol}`)
}
