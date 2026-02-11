const BINANCE_QUANTITY_PRECISION: Record<string, number> = {
  BTCUSDC: 5,
  ETHUSDC: 4,
  SOLUSDC: 3,
  PAXGUSDC: 4,
  TRXUSDC: 1,
}

export function getStepSizeDecimals(symbol: string): number {
  const precision = BINANCE_QUANTITY_PRECISION[symbol]

  if (precision === undefined) {
    throw new Error(
      `Missing Binance precision configuration for symbol '${symbol}'. Please add it to 'step-size-helper`,
    )
  }

  return precision
}

export function truncateToDecimals(number: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.floor(number * factor) / factor
}
