import { Container } from '../../src/di'
import { EvaluationRepository } from '../../src/application/repositories/evaluation-repository'
import { Evaluation } from '../../src/domain/types/evaluation'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const loggerService = Container.getLoggerService()
  const evaluationRepository: EvaluationRepository =
    Container.getEvaluationRepository()

  const fakeEvaluation: Evaluation = {
    action: 'BUY',
    confidence: 0.7,
    reasoning: 'Fake reasoning...',
    symbol: 'BTCUSDC',
    timeFrame: 60,
    price: 1.0,
    model: 'gemini-2.5-flash-lite',
  }

  await evaluationRepository.save(fakeEvaluation)

  loggerService.debug(contextScript, 'Fake evaluation saved')
}
