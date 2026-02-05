import { DecisionMaker } from '../../application/decision-maker'

export class DecisionMakerService {
  constructor(private readonly api: DecisionMaker) {}

  async analize(marketData: string): Promise<void> {
    return this.api.analyze(marketData)
  }
}
