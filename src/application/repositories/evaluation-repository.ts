import { Evaluation } from '../../domain/types/evaluation'

export interface EvaluationRepository {
  save(evaluation: Evaluation): Promise<void>
}
