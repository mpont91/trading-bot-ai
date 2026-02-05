import { prisma } from '../db/prisma-client'
import { AdviceRepository } from '../../application/repositories/advice-repository'
import { Evaluation } from '../../domain/types/evaluation'

export class PrismaEvaluationRepository implements AdviceRepository {
  async save(evaluation: Evaluation): Promise<void> {
    await prisma.evaluation.create({
      data: {
        symbol: evaluation.symbol,
        timeFrame: String(evaluation.timeFrame),
        price: evaluation.price,
        model: evaluation.model,
        action: evaluation.action,
        confidence: evaluation.confidence,
        reasoning: evaluation.reasoning,
      },
    })
  }
}
