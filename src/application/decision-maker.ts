import { TechnicalAnalysis } from '../domain/types/technical-analysis'
import { DecisionTrade } from '../domain/types/decision'

export interface DecisionMaker {
  decide(technicalAnalysis: TechnicalAnalysis): Promise<DecisionTrade>
}
