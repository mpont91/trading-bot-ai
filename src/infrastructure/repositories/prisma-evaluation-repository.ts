import { prisma } from '../db/prisma-client'
import { EvaluationRepository } from '../../application/repositories/evaluation-repository'
import { Evaluation } from '../../domain/types/evaluation'
import { EvaluationFilter } from '../../domain/filters/evaluation-filter'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../domain/types/paginated'
import { EvaluationMapper } from './mappers/evaluation-mapper'

export class PrismaEvaluationRepository implements EvaluationRepository {
  async save(evaluation: Evaluation): Promise<void> {
    await prisma.evaluation.create({
      data: {
        symbol: evaluation.symbol,
        timeFrame: String(evaluation.timeFrame),
        price: evaluation.price,
        model: evaluation.model,
        action: evaluation.action,
        confidence: evaluation.confidence,
        reasoning: evaluation.reasoning,
      },
    })
  }

  async list(filters: EvaluationFilter): Promise<Paginated<Evaluation>> {
    const { page, limit, startDate, endDate, symbol } = filters

    const where: Prisma.EvaluationWhereInput = {}

    if (symbol) {
      where.symbol = { contains: symbol }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [data, total] = await Promise.all([
      prisma.evaluation.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.evaluation.count({ where }),
    ])

    return {
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
      data: data.map(EvaluationMapper.toDomain),
    }
  }
}
