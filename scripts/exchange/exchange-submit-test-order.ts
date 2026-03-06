import { Container } from '../../src/di'
import { z } from 'zod'
import { OrderRequest, orderSideSchema } from '../../src/domain/types/order'
import { ExchangeService } from '../../src/domain/services/exchange-service'
import { contextScript } from '../run'

const requestSchema = z.object({
  symbol: z.string(),
  side: orderSideSchema,
  quantity: z.coerce.number(),
})

export default async function (args: string[]): Promise<void> {
  const [symbol, side, quantity] = args

  const orderRequest: OrderRequest = requestSchema.parse({
    symbol,
    side,
    quantity,
  })

  const loggerService = Container.getLoggerService()
  const exchangeService: ExchangeService = Container.getExchangeService()
  await exchangeService.submitTestOrder(orderRequest)

  loggerService.debug(contextScript, 'Test order submitted correctly')
}
