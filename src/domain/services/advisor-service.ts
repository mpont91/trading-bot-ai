import { Advisor } from '../../application/advisor'
import { Advice } from '../types/advice'
import { Analysis } from '../types/analysis'
import { Position } from '../types/position'

export class AdvisorService {
  constructor(private readonly api: Advisor) {}

  async advice(
    symbol: string,
    analysis: Analysis,
    position: Position | null,
  ): Promise<Advice> {
    return this.api.advice(symbol, analysis, position)
  }
}
