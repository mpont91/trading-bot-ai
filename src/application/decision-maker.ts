import { TechnicalAnalysis } from '../domain/types/technical-analysis'
import { TradeDecision } from '../domain/types/trade-decision'

export interface DecisionMaker {
  decide(technicalAnalysis: TechnicalAnalysis): Promise<TradeDecision>
}
