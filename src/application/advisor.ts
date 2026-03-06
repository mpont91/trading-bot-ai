import { Analysis } from '../domain/types/analysis'
import { Advice } from '../domain/types/advice'
import { Position } from '../domain/types/position'
import { TimeFrame } from '../domain/types/time-frame'

export interface Advisor {
  advice(
    symbol: string,
    timeFrame: TimeFrame,
    analysis: Analysis,
    position: Position | null,
  ): Promise<Advice>
}
