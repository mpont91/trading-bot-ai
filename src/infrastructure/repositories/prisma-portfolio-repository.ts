import { prisma } from '../db/prisma-client'
import { PortfolioRepository } from '../../application/repositories/portfolio-repository'
import { Portfolio } from '../../domain/types/portfolio'

export class PrismaPortfolioRepository implements PortfolioRepository {
  async save(portfolio: Portfolio): Promise<Portfolio> {
    const record = await prisma.portfolio.create({
      data: {
        equity: portfolio.equity,
        bnb: portfolio.bnb,
      },
    })

    return {
      id: record.id,
      timestamp: record.timestamp,
      equity: Number(record.equity),
      bnb: Number(record.bnb),
    }
  }

  async getLatest(): Promise<Portfolio | null> {
    const record = await prisma.portfolio.findFirst({
      orderBy: { timestamp: 'desc' },
    })

    if (!record) return null

    return {
      id: record.id,
      timestamp: record.timestamp,
      equity: Number(record.equity),
      bnb: Number(record.bnb),
    }
  }
}
