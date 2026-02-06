import { Analysis } from '../domain/types/analysis'
import { Advice } from '../domain/types/advice'
import { Position } from '../domain/types/position'

export interface Advisor {
  advice(
    symbol: string,
    analysis: Analysis,
    position: Position | null,
  ): Promise<Advice>
}
