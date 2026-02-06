import { Request, Response } from 'express'
import { EvaluationRepository } from '../../../application/repositories/evaluation-repository'
import { parseQuery } from '../helpers/query-parser'
import { evaluationFilterSchema } from '../../../domain/filters/evaluation-filter'

export class EvaluationController {
  constructor(private readonly repository: EvaluationRepository) {}

  async getEvaluations(request: Request, response: Response) {
    const filters = parseQuery(request, evaluationFilterSchema)
    const result = await this.repository.list(filters)
    response.json(result)
  }
}
