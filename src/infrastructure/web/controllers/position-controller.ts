import { Request, Response } from 'express'
import { parseQuery } from '../helpers/query-parser'
import { positionFilterSchema } from '../../../domain/filters/position-filter'
import { PositionRepository } from '../../../application/repositories/position-repository'

export class PositionController {
  constructor(private readonly repository: PositionRepository) {}

  async getPositions(request: Request, response: Response) {
    const filters = parseQuery(request, positionFilterSchema)
    const result = await this.repository.list(filters)
    response.json(result)
  }
}
