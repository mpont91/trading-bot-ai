export function adjustQuantityToStepSize(
  quantity: number,
  stepSize: number,
): number {
  const inverse = 1 / stepSize
  const adjusted = Math.floor(quantity * inverse) / inverse
  const decimals = (stepSize.toString().split('.')[1] || '').length

  return parseFloat(adjusted.toFixed(decimals))
}
