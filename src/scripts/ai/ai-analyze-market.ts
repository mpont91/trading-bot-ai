import { Container } from '../../di'
import { AiService } from '../../domain/services/ai-service'

export default async function (): Promise<void> {
  const mockMarketData = JSON.stringify({
    symbol: 'BTCUSDT',
    currentPrice: 95000,
    rsi: 75, // Sobrecomprado
    macd: 'bearish_crossover',
    lastCandles: ['green', 'green', 'red_doji'],
  })

  const aiService: AiService = Container.getAiService()
  await aiService.analize(mockMarketData)
}
