import { Container } from '../../di'
import { TradingService } from '../../domain/services/trading-service'

export default async function (): Promise<void> {
  const tradingService: TradingService = Container.getTradingService()
  const response: number = await tradingService.getEquity()

  console.log(response)
}
