const BINANCE_STEP_SIZES: Record<string, number> = {
  AVAXUSDC: 0.01,
  POLUSDC: 0.1,
  UNIUSDC: 0.01,
  AAVEUSDC: 0.001,
  DOGEUSDC: 1,
  BCHUSDC: 0.001,
  ETCUSDC: 0.01,
}

export function getStepSize(symbol: string): number {
  const stepSize = BINANCE_STEP_SIZES[symbol]

  if (stepSize === undefined) {
    throw new Error(
      `Missing Binance precision configuration for symbol '${symbol}'. Please add it to 'step-size-helper`,
    )
  }

  return stepSize
}

export function adjustQuantityToStepSize(
  quantity: number,
  stepSize: number,
): number {
  const inverse = 1 / stepSize
  const adjusted = Math.floor(quantity * inverse) / inverse
  const decimals = (stepSize.toString().split('.')[1] || '').length

  return parseFloat(adjusted.toFixed(decimals))
}
