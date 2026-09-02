// Presenters: map DTOs to view-models. All interpretation logic lives here
// (and in models) so view components contain no business logic and no
// complex inline JS — they only render props.

import type {
  BalanceSheetDTO,
  BenefitTileDTO,
  CompBreakdownDTO,
  CompScenariosDTO,
  CompTileDTO,
  HealthTileDTO,
  NetWorthTileDTO,
  PortfolioTileDTO,
  RetirementTileDTO,
  VestingEventDTO,
} from '@/lib/types'
import { formatCurrency, formatCurrencyK, formatCurrencyWhole, formatStockPrice } from '@/lib/format'

export interface BenefitTileView {
  id: string
  title: string
  primaryValue: string
  secondaryText: string
  secondaryClassName: 'plain' | 'trendUp' | 'trendDown'
}

export function toBenefitTileView(tile: BenefitTileDTO): BenefitTileView {
  const primaryValue =
    tile.variant === 'date' ? (tile.date ?? '') : formatCurrency(tile.amount ?? 0)

  let secondaryText = ''
  let secondaryClassName: BenefitTileView['secondaryClassName'] = 'plain'
  if (tile.variant === 'description' || tile.variant === 'date') {
    secondaryText = tile.description ?? ''
  } else if (tile.variant === 'expiry') {
    secondaryText = `Expires ${tile.expiryDate ?? ''}`
  } else if (tile.variant === 'trend') {
    secondaryText = `${tile.trendPercent ?? 0}%`
    secondaryClassName = tile.trendDirection === 'down' ? 'trendDown' : 'trendUp'
  }

  return { id: tile.id, title: tile.title, primaryValue, secondaryText, secondaryClassName }
}

/** Maps a compensation tile onto the shared BenefitTileView so the Total Comp
 *  page reuses the same dumb tile renderer: amounts at 22px on white tiles,
 *  trend rows (green up / red down arrow) for Cash Bonus and Open Enrollment. */
export function toCompTileView(tile: CompTileDTO): BenefitTileView {
  const primaryValue =
    tile.variant === 'date-trend' ? (tile.date ?? '') : formatCurrency(tile.amount ?? 0)

  let secondaryText = ''
  let secondaryClassName: BenefitTileView['secondaryClassName'] = 'plain'
  if (tile.variant === 'description') {
    secondaryText = tile.description ?? ''
  } else if (tile.variant === 'trend') {
    secondaryText = `${tile.trendPercent ?? 0}%`
    secondaryClassName = tile.trendDirection === 'down' ? 'trendDown' : 'trendUp'
  } else {
    secondaryText = `${tile.trendPercent ?? 0}% YOY`
    secondaryClassName = tile.trendDirection === 'down' ? 'trendDown' : 'trendUp'
  }

  return { id: tile.id, title: tile.title, primaryValue, secondaryText, secondaryClassName }
}

export type BadgeTone = 'good' | 'warn'

export interface HealthTileView {
  id: string
  title: string
  status: string
  badgeTone: BadgeTone
  description: string
  statLine: string
  utilization: number
  /** CSS-module class key for the thermometer fill width, e.g. 'fill80'. */
  fillClassKey: string
  /** CSS-module class key for the thermometer fill color. */
  toneClassKey: 'fillHigh' | 'fillLow'
}

const POSITIVE_STATUSES: ReadonlySet<string> = new Set(['ACTIVE', 'ENROLLED'])

const UTILIZATION_HIGH_THRESHOLD = 80
const WIDTH_STEP = 5

/** Round utilization to the nearest width-step so views can use discrete
 *  CSS classes instead of inline styles. */
export function utilizationWidthKey(utilization: number): string {
  const clamped = Math.min(100, Math.max(0, utilization))
  const bucket = Math.round(clamped / WIDTH_STEP) * WIDTH_STEP
  return `fill${bucket}`
}

export function toHealthTileView(tile: HealthTileDTO): HealthTileView {
  return {
    id: tile.id,
    title: tile.title,
    status: tile.status,
    badgeTone: POSITIVE_STATUSES.has(tile.status) ? 'good' : 'warn',
    description: tile.description,
    statLine: `UTILIZATION: ${tile.utilization}% | ${tile.stat}`,
    utilization: tile.utilization,
    fillClassKey: utilizationWidthKey(tile.utilization),
    toneClassKey: tile.utilization >= UTILIZATION_HIGH_THRESHOLD ? 'fillHigh' : 'fillLow',
  }
}

/** Retirement tiles: standard variants reuse the shared BenefitTileView; the
 *  'detail' variant produces the 401K contribution card view-model — two
 *  contribution tiles, an IRS-limit thermometer, and an info tip. */
export interface RetirementContributionView {
  percentText: string
  amountText: string
}

export interface RetirementDetailView {
  layout: 'detail'
  id: string
  title: string
  contributions: RetirementContributionView[]
  progressText: string
  percentSpent: number
  /** CSS-module class keys for the thermometer fill width and color. */
  fillClassKey: string
  toneClassKey: 'fillHigh' | 'fillLow'
  infoCategory: string
  infoType: string
  infoDescription: string
}

/** 'unvested' variant (PLTR RSU card): two side-by-side unvested summary
 *  panels between gray dividers, then the borderless vesting-events table.
 *  Text passes straight through — it arrives display-ready. */
export interface RetirementUnvestedView {
  layout: 'unvested'
  id: string
  title: string
  unvestedTotalType: string
  unvestedSharesText: string
  unvestedSharesType: string
  unvestedValueType: string
  unvestedValueText: string
  unvestedPriceType: string
  vestingEvents: VestingEventDTO[]
}

export type RetirementTileView =
  | { layout: 'standard'; standard: BenefitTileView }
  | RetirementDetailView
  | RetirementUnvestedView

export function toRetirementTileView(tile: RetirementTileDTO): RetirementTileView {
  if (tile.variant === 'unvested') {
    return {
      layout: 'unvested',
      id: tile.id,
      title: tile.title,
      unvestedTotalType: tile.unvestedTotalType ?? '',
      unvestedSharesText: tile.unvestedSharesText ?? '',
      unvestedSharesType: tile.unvestedSharesType ?? '',
      unvestedValueType: tile.unvestedValueType ?? '',
      unvestedValueText: tile.unvestedValueText ?? '',
      unvestedPriceType: tile.unvestedPriceType ?? '',
      vestingEvents: tile.vestingEvents ?? [],
    }
  }

  if (tile.variant !== 'detail') {
    return { layout: 'standard', standard: toBenefitTileView({ ...tile, variant: tile.variant }) }
  }

  const percentSpent = tile.percentSpent ?? 0
  return {
    layout: 'detail',
    id: tile.id,
    title: tile.title,
    contributions: (tile.contributions ?? []).map((contribution) => ({
      percentText: `${contribution.contributionPercent}%`,
      amountText: `${formatCurrencyWhole(contribution.contributionAmount)}/yr`,
    })),
    progressText: `${formatCurrencyWhole(tile.contributedAmount ?? 0)} of ${formatCurrencyWhole(
      tile.irsLimit ?? 0
    )} IRS limit contributed (${percentSpent}%)`,
    percentSpent,
    fillClassKey: utilizationWidthKey(percentSpent),
    toneClassKey: percentSpent >= UTILIZATION_HIGH_THRESHOLD ? 'fillHigh' : 'fillLow',
    infoCategory: tile.infoCategory ?? '',
    infoType: tile.infoType ?? '',
    infoDescription: tile.infoDescription ?? '',
  }
}

/** Dashboard net-worth tiles: pass the DTO display text straight through —
 *  the view only renders it. */
export type NetWorthTileView = NetWorthTileDTO

export function toNetWorthTileView(tile: NetWorthTileDTO): NetWorthTileView {
  return tile
}

/** Dashboard balance sheet tile: report/feed rows pass through; the stock
 *  percent is formatted for display and bucketed to a discrete gauge class
 *  key so the circular thermometer needs no inline styles. Holdings pass
 *  their display text straight through with the tone defaulted to black. */
export interface BalanceSheetHoldingView {
  id: string
  investmentType: string
  investmentValue: string
  valueTone: 'black' | 'maroon'
}

export interface BalanceSheetView {
  id: string
  reportType: string
  feedType: string
  stockType: string
  stockPercent: number
  stockPercentText: string
  /** CSS-module class key for the circular gauge arc, e.g. 'gaugeFill70'. */
  gaugeFillClassKey: string
  holdings: BalanceSheetHoldingView[]
  totalType: string
  totalValue: string
}

export function toBalanceSheetView(report: BalanceSheetDTO): BalanceSheetView {
  return {
    id: report.id,
    reportType: report.reportType,
    feedType: report.feedType,
    stockType: report.stockType,
    stockPercent: report.stockPercent,
    stockPercentText: `${report.stockPercent}%`,
    gaugeFillClassKey: `gauge${utilizationWidthKey(report.stockPercent).replace(/^fill/, 'Fill')}`,
    holdings: report.holdings.map((holding) => ({
      id: holding.id,
      investmentType: holding.investmentType,
      investmentValue: holding.investmentValue,
      valueTone: holding.valueTone ?? 'black',
    })),
    totalType: report.totalType,
    totalValue: report.totalValue,
  }
}

/** Quick-action (portfolio) tiles: resolve the tiny icon shown under the
 *  black bar from the tile id. */
export interface PortfolioTileView {
  id: string
  title: string
  iconSrc?: string
}

const QUICK_ACTION_ICONS: Record<string, string> = {
  'net-worth': '/icons/net-worth.png',
  'rsu-vest': '/icons/rsu-vest.png',
  'risk-conc': '/icons/risk-conc.png',
  '401k-match': '/icons/401k-match.png',
}

export function toPortfolioTileView(tile: PortfolioTileDTO): PortfolioTileView {
  return { id: tile.id, title: tile.title, iconSrc: QUICK_ACTION_ICONS[tile.id] }
}

/** Compensation breakdown tile: one thermometer row per compensation type
 *  plus the bold total row. Amounts render compact ("$185K"); the total
 *  renders whole-dollar ("$312,050"). */
export interface CompBreakdownRowView {
  id: string
  compType: string
  amountText: string
  percentText: string
  /** CSS-module class key for the thermometer fill width, e.g. 'fill60'. */
  fillClassKey: string
}

export interface CompBreakdownView {
  rows: CompBreakdownRowView[]
  totalCompText: string
}

/** Round to the nearest width-step; any non-zero percent keeps at least one
 *  visible step so small shares (e.g. 1.6%) still show a sliver. */
function breakdownWidthKey(percent: number): string {
  if (percent > 0 && percent < WIDTH_STEP) {
    return `fill${WIDTH_STEP}`
  }
  return utilizationWidthKey(percent)
}

export function toCompBreakdownView(breakdown: CompBreakdownDTO): CompBreakdownView {
  return {
    rows: breakdown.rows.map((row) => ({
      id: row.id,
      compType: row.compType,
      amountText: formatCurrencyK(row.compAmount),
      percentText: `${row.compPercent}%`,
      fillClassKey: breakdownWidthKey(row.compPercent),
    })),
    totalCompText: formatCurrencyWhole(breakdown.totalComp),
  }
}

/** Stock scenario mini tiles (bear/current/bull) plus the disclosure note. */
export interface StockScenarioView {
  id: string
  stockType: string
  stockValueText: string
  totalValueText: string
}

export interface CompScenariosView {
  scenarios: StockScenarioView[]
  disclosureText: string
}

export function toCompScenariosView(data: CompScenariosDTO): CompScenariosView {
  return {
    scenarios: data.scenarios.map((scenario) => ({
      id: scenario.id,
      stockType: scenario.stockType,
      stockValueText: formatStockPrice(scenario.stockValue),
      totalValueText: formatCurrencyWhole(scenario.totalValue),
    })),
    disclosureText: data.disclosureText,
  }
}
