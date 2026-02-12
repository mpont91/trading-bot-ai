import { Paginated } from '../../domain/types/paginated'
import { PositionFilter } from '../../domain/filters/position-filter'
import { Position } from '../../domain/types/position'

export interface PositionRepository {
  save(position: Position): Promise<Position>
  findOpen(symbol: string): Promise<Position | null>
  list(filters: PositionFilter): Promise<Paginated<Position>>
}
