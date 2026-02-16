import { prisma } from '../db/prisma-client'
import { EvaluationRepository } from '../../application/repositories/evaluation-repository'
import { Evaluation } from '../../domain/types/evaluation'
import { EvaluationFilter } from '../../domain/filters/evaluation-filter'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../domain/types/paginated'
import { EvaluationMapper } from './mappers/evaluation-mapper'
import {
  buildPaginatedResponse,
  getDateRangeFilter,
  getPaginationParams,
} from './helpers/prisma-helper'

export class PrismaEvaluationRepository implements EvaluationRepository {
  async save(evaluation: Evaluation): Promise<Evaluation> {
    const record = await prisma.evaluation.create({
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

    return EvaluationMapper.toDomain(record)
  }

  async list(filters: EvaluationFilter): Promise<Paginated<Evaluation>> {
    const { page, limit, startDate, endDate, symbol, action } = filters

    const where: Prisma.EvaluationWhereInput = {
      symbol: symbol ? { equals: symbol } : undefined,
      action: action ? { equals: action } : undefined,
      createdAt: getDateRangeFilter(startDate, endDate),
    }

    const [data, total] = await Promise.all([
      prisma.evaluation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPaginationParams(page, limit),
      }),
      prisma.evaluation.count({ where }),
    ])

    return buildPaginatedResponse(
      data,
      total,
      page,
      limit,
      EvaluationMapper.toDomain,
    )
  }
}
