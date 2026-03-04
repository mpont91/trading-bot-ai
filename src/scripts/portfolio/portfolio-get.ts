import { Container } from '../../di'
import { PortfolioService } from '../../domain/services/portfolio-service'
import { Portfolio } from '../../domain/types/portfolio'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const loggerService = Container.getLoggerService()
  const portfolioService: PortfolioService = Container.getPortfolioService()
  const response: Portfolio = await portfolioService.getPortfolio()

  loggerService.dump(contextScript, 'Portfolio:🟩', response)
}
