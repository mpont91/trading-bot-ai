import { Analysis } from '../domain/types/analysis'
import { Advice } from '../domain/types/advice'

export interface Advisor {
  advice(analysis: Analysis): Promise<Advice>
}
