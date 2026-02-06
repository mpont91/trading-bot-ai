import { Evaluation as PrismaEvaluation } from '@prisma/client'
import { parseTimeFrame } from '../../../domain/types/time-frame'
import { parseAdviceAction } from '../../../domain/types/advice'
import { Evaluation } from '../../../domain/types/evaluation'

export class EvaluationMapper {
  static toDomain(raw: PrismaEvaluation): Evaluation {
    return {
      id: raw.id,
      symbol: raw.symbol,
      model: raw.model,
      confidence: raw.confidence,
      reasoning: raw.reasoning,
      createdAt: raw.createdAt,
      price: raw.price.toNumber(),
      timeFrame: parseTimeFrame(raw.timeFrame),
      action: parseAdviceAction(raw.action),
    }
  }
}
