import { Request, Response } from 'express'
import { OrderRepository } from '../../../application/repositories/order-repository'
import { parseQuery } from '../helpers/query-parser'
import { orderFilterSchema } from '../../../domain/filters/order-filter'

export class OrderController {
  constructor(private readonly repository: OrderRepository) {}

  async getOrders(request: Request, response: Response) {
    const filters = parseQuery(request, orderFilterSchema)
    const result = await this.repository.list(filters)
    response.json(result)
  }
}
