import { DecisionContext, DecisionTrade } from '../../domain/types/decision'

export interface DecisionRepository {
  save(
    decisionContext: DecisionContext,
    decisionTrade: DecisionTrade,
  ): Promise<void>
}
