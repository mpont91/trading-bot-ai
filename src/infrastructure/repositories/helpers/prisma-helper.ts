export const getPaginationParams = (page: number = 1, limit: number = 10) => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.max(1, limit)

  return {
    take: safeLimit,
    skip: (safePage - 1) * safeLimit,
  }
}

export const getDateRangeFilter = (
  startDate?: Date | string,
  endDate?: Date | string,
) => {
  if (!startDate && !endDate) return undefined

  const filter: { gte?: Date; lte?: Date } = {}

  if (startDate) {
    filter.gte = new Date(startDate)
  }

  if (endDate) {
    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)
    filter.lte = endOfDay
  }

  return filter
}

export const buildPaginatedResponse = <T, D>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  mapper: (item: T) => D,
) => {
  return {
    data: data.map(mapper),
    total,
    page,
    limit,
    lastPage: Math.ceil(total / limit),
  }
}
