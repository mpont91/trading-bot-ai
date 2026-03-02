import { Container } from '../../di'
import { TradingService } from '../../domain/services/trading-service'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const loggerService = Container.getLoggerService()
  const tradingService: TradingService = Container.getTradingService()
  const response: number = await tradingService.getEquity()

  loggerService.debug(contextScript, `Equity: $${response}`)
}
