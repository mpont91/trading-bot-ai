import { Performance } from '../../domain/types/performance'

export interface PerformanceRepository {
  getPerformance(): Promise<Performance>
}
