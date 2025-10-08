export const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

export const formatPercent = (value: number, minimumFractionDigits: number = 2) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(minimumFractionDigits)}%`
}

export const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
