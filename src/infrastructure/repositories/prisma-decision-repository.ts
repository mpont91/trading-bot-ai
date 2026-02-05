import { prisma } from '../db/prisma-client'
import { DecisionRepository } from '../../application/repositories/decision-repository'
import { DecisionContext, DecisionTrade } from '../../domain/types/decision'

export class PrismaDecisionRepository implements DecisionRepository {
  async save(context: DecisionContext, trade: DecisionTrade): Promise<void> {
    await prisma.decision.create({
      data: {
        symbol: context.symbol,
        timeFrame: String(context.timeFrame),
        price: context.price,
        model: context.model,
        decision: trade.decision,
        confidence: trade.confidence,
        reasoning: trade.reasoning,
      },
    })
  }
}
