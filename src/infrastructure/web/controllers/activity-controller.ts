import { Request, Response } from 'express'
import { ActivityRepository } from '../../../application/repositories/activity-repository'
import { parseQuery } from '../helpers/query-parser'
import { activityFilterSchema } from '../../../domain/filters/activity-filter'

export class ActivityController {
  constructor(private readonly repository: ActivityRepository) {}

  async getActivities(request: Request, response: Response) {
    const filters = parseQuery(request, activityFilterSchema)
    const result = await this.repository.list(filters)
    response.json(result)
  }
}
