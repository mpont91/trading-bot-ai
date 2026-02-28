import { Portfolio } from '../../domain/types/portfolio'

export interface PortfolioRepository {
  save(portfolio: Portfolio): Promise<Portfolio>
  getLatest(): Promise<Portfolio | null>
}
