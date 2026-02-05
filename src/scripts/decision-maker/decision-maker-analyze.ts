import { Container } from '../../di'
import { DecisionMakerService } from '../../domain/services/decision-maker-service'

export default async function (): Promise<void> {
  const mockMarketData = JSON.stringify({
    symbol: 'BTCUSDT',
    currentPrice: 95000,
    rsi: 75, // Sobrecomprado
    macd: 'bearish_crossover',
    lastCandles: ['green', 'green', 'red_doji'],
  })

  const decisionMakerService: DecisionMakerService =
    Container.getDecisionMakerService()
  await decisionMakerService.analize(mockMarketData)
}
