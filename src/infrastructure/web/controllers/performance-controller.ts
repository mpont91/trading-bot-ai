import { Request, Response } from 'express'
import { PerformanceRepository } from '../../../application/repositories/performance-repository'

export class PerformanceController {
  constructor(private readonly repository: PerformanceRepository) {}

  async getPerformance(request: Request, response: Response) {
    const result = await this.repository.getPerformance()
    response.json({ data: result })
  }
}
