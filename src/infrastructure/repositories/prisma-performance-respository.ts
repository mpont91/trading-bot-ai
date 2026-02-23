import { prisma } from '../db/prisma-client'
import { PositionStatus } from '../../domain/types/position'
import { Performance } from '../../domain/types/performance'
import { PerformanceRepository } from '../../application/repositories/performance-repository'

export class PrismaPerformanceRepository implements PerformanceRepository {
  async getPerformance(): Promise<Performance> {
    const positionStats = await prisma.position.aggregate({
      where: { status: PositionStatus.CLOSED },
      _sum: { pnl: true },
      _count: { id: true },
    })

    const totalTrades = positionStats._count.id
    const totalPnl = positionStats._sum.pnl?.toNumber() || 0

    const winningTrades = await prisma.position.count({
      where: {
        status: PositionStatus.CLOSED,
        pnl: { gt: 0 },
      },
    })

    const orderStats = await prisma.order.aggregate({
      _sum: { fees: true },
    })

    const totalFees = orderStats._sum.fees?.toNumber() || 0

    const losingTrades = totalTrades - winningTrades
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalPnl,
      totalFees,
    }
  }
}
