import { Evaluation } from '../../domain/types/evaluation'
import { EvaluationFilter } from '../../domain/filters/evaluation-filter'
import { Paginated } from '../../domain/types/paginated'

export interface EvaluationRepository {
  save(evaluation: Evaluation): Promise<void>
  list(filters: EvaluationFilter): Promise<Paginated<Evaluation>>
}
