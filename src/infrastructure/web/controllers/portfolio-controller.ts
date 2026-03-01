import { Request, Response } from 'express'
import { PortfolioService } from '../../../domain/services/portfolio-service'

export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  async getPortfolio(request: Request, response: Response) {
    const result = await this.portfolioService.getPortfolio()
    response.json({ data: result })
  }
}
