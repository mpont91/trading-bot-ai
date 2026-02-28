import { Request, Response } from 'express'
import { PortfolioService } from '../../../domain/services/portfolio-service'

export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  async getLatest(request: Request, response: Response) {
    const result = await this.portfolioService.getLatest()
    response.json({ data: result })
  }
}
