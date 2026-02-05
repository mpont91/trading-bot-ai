import { DecisionMaker } from '../../application/decision-maker'
import { TradeDecision } from '../types/trade-decision'
import { TechnicalAnalysis } from '../types/technical-analysis'

export class DecisionMakerService {
  constructor(private readonly api: DecisionMaker) {}

  async decide(technicalAnalysis: TechnicalAnalysis): Promise<TradeDecision> {
    return this.api.decide(technicalAnalysis)
  }
}
