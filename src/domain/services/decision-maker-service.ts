import { DecisionMaker } from '../../application/decision-maker'
import { DecisionTrade } from '../types/decision'
import { TechnicalAnalysis } from '../types/technical-analysis'

export class DecisionMakerService {
  constructor(private readonly api: DecisionMaker) {}

  async decide(technicalAnalysis: TechnicalAnalysis): Promise<DecisionTrade> {
    return this.api.decide(technicalAnalysis)
  }
}
