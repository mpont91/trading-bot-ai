import { Container } from '../../di'
import { PortfolioService } from '../../domain/services/portfolio-service'
import { Portfolio } from '../../domain/types/portfolio'

export default async function (): Promise<void> {
  const portfolioService: PortfolioService = Container.getPortfolioService()
  const response: Portfolio = await portfolioService.record()

  console.dir(response, { depth: null })
}
