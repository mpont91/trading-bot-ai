import { Advisor } from '../../application/advisor'
import { Advice } from '../types/advice'
import { Analysis } from '../types/analysis'

export class AdvisorService {
  constructor(private readonly api: Advisor) {}

  async advice(analysis: Analysis): Promise<Advice> {
    return this.api.advice(analysis)
  }
}
