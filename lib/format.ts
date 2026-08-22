// Pure formatting helpers usable by both server and client.

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const wholeCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

/** Whole-dollar currency, e.g. "$14,800" — used by the retirement detail card. */
export function formatCurrencyWhole(amount: number): string {
  return wholeCurrencyFormatter.format(amount)
}

/** Compact thousands currency, e.g. "$185K" — used by the comp breakdown. */
export function formatCurrencyK(amount: number): string {
  return `$${Math.round(amount / 1000)}K`
}

/** Dollar price without forced decimals: cents only when fractional
 *  ("$65", "$121.08") — used by the stock scenario mini tiles. */
export function formatStockPrice(amount: number): string {
  return Number.isInteger(amount) ? formatCurrencyWhole(amount) : formatCurrency(amount)
}
