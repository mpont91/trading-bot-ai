import { Container } from '../../src/di'
import { ExchangeService } from '../../src/domain/services/exchange-service'
import { Order } from '../../src/domain/types/order'
import { z } from 'zod'
import { contextScript } from '../run'

const requestSchema = z.object({
  symbol: z.string(),
  orderId: z.string(),
})

export default async function (args: string[]): Promise<void> {
  const [symbolRequest, orderIdRequest] = args

  const { symbol, orderId } = requestSchema.parse({
    symbol: symbolRequest,
    orderId: orderIdRequest,
  })

  const loggerService = Container.getLoggerService()
  const exchangeService: ExchangeService = Container.getExchangeService()
  const response: Order = await exchangeService.getOrder(symbol, orderId)

  loggerService.dump(contextScript, 'Order:', response)
}
