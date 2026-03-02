import { Container } from '../../di'
import { z } from 'zod'
import { Order, OrderRequest, orderSideSchema } from '../../domain/types/order'
import { ExchangeService } from '../../domain/services/exchange-service'
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
  const response: Order = await exchangeService.submitOrder(orderRequest)

  loggerService.dump(contextScript, 'Order submitted:', response)
}
