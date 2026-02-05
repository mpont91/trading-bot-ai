import { Evaluation } from '../../domain/types/evaluation'

export interface AdviceRepository {
  save(evaluation: Evaluation): Promise<void>
}
