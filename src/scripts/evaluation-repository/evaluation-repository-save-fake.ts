import { Container } from '../../di'
import { EvaluationRepository } from '../../application/repositories/evaluation-repository'
import { Evaluation } from '../../domain/types/evaluation'

export default async function (): Promise<void> {
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
}
