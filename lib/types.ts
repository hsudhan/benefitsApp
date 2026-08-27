// Shared DTO contract between the REST API (controllers) and the client
// (views). Pure types only — no runtime code, no data access. Clients and
// servers stay loosely coupled through this contract.

export type TileVariant = 'description' | 'trend' | 'expiry' | 'date'

export interface BenefitTileDTO {
  id: string
  title: string
  variant: TileVariant
  amount?: number
  description?: string
  trendDirection?: 'up' | 'down'
  trendPercent?: number
  expiryDate?: string
  date?: string
}

/** Retirement & equity tiles are their own resource with their own DTO and
 *  backing table — they intentionally do not reuse BenefitTileDTO. The
 *  'detail' variant renders the full contribution card (contribution tiles,
 *  IRS-limit thermometer, and info tip) from the detail fields below. */
export type RetirementTileVariant = TileVariant | 'detail'

export interface RetirementContributionDTO {
  contributionPercent: number
  contributionAmount: number
}

export interface RetirementTileDTO {
  id: string
  title: string
  variant: RetirementTileVariant
  amount?: number
  description?: string
  trendDirection?: 'up' | 'down'
  trendPercent?: number
  expiryDate?: string
  date?: string
  /** Detail-card fields (variant 'detail'). */
  contributions?: RetirementContributionDTO[]
  contributedAmount?: number
  irsLimit?: number
  percentSpent?: number
  infoCategory?: string
  infoType?: string
  infoDescription?: string
}

/** Compensation tiles (Total Comp page) are their own resource with their
 *  own DTO and backing table — they intentionally do not reuse
 *  BenefitTileDTO. The 'date-trend' variant pairs a date primary value with
 *  a trend indicator in the secondary row. */
export type CompTileVariant = 'description' | 'trend' | 'date-trend'

export interface CompTileDTO {
  id: string
  title: string
  variant: CompTileVariant
  amount?: number
  description?: string
  trendDirection?: 'up' | 'down'
  trendPercent?: number
  date?: string
}

export interface PortfolioTileDTO {
  id: string
  title: string
  description: string
}

export type HealthStatus = 'ACTIVE' | 'ENROLLED' | 'UNCLAIMED' | 'PARTIAL'

export interface HealthTileDTO {
  id: string
  title: string
  status: HealthStatus
  description: string
  utilization: number
  stat: string
}

export interface QuickLinkDTO {
  label: string
  href: string
}

/** Dashboard net-worth tiles are their own resource with their own DTO and
 *  backing table — they intentionally do not reuse BenefitTileDTO. Amounts
 *  arrive as exact display text (e.g. "$1.24M", "$4,820") because the spec
 *  mixes compact and full formats. The 'green' tone renders the description
 *  in green; an action label/href renders a gray oval hyperlink button. The
 *  'gray' tile tone renders the tile itself on #f3f5f7 (dashboard tiles
 *  1 & 2); undefined renders the default card white. */
export interface NetWorthTileDTO {
  id: string
  title: string
  valueText: string
  description?: string
  descriptionTone?: 'plain' | 'green'
  tileTone?: 'white' | 'gray'
  actionLabel?: string
  actionHref?: string
}

/** A single action tile in the dashboard priority-actions panel: gray
 *  category title, big bold action title, description, and a gray oval
 *  action button with blue foreground. */
export interface PriorityActionDTO {
  id: string
  actionCategory: string
  actionTitle: string
  actionDescription: string
  actionLabel: string
  actionHref: string
}

/** Dashboard priority actions tile (single-row resource): big bold
 *  actionsTitle header over a white panel of three action tiles. */
export interface PriorityActionsDTO {
  id: string
  actionsTitle: string
  actions: PriorityActionDTO[]
}

/** A single RSU grant tranche row in the equity report's grant table. */
export interface EquityGrantDTO {
  id: string
  sharesText: string
  valueText: string
  description: string
  status: 'VESTED' | 'UNVESTED'
}

/** Dashboard equity report tile (single-row resource): big bold report type,
 *  feed type row, a white sub-tile with the equity value + share count, and
 *  a grant-by-grant vesting table. */
export interface EquityReportDTO {
  id: string
  reportType: string
  feedType: string
  equityValueType: string
  equityValue?: string
  equityShareCount?: string
  shareAccountType?: string
  grants: EquityGrantDTO[]
  stockType?: string
  lastUpdated?: string
}

/** A single holding/liability row in the balance sheet's holdings table.
 *  Values arrive as exact display text (e.g. "$842,400", "-$38,200") because
 *  the spec mixes formats. Maroon tone flags liabilities (negative values);
 *  undefined renders black. */
export interface BalanceSheetHoldingDTO {
  id: string
  investmentType: string
  investmentValue: string
  valueTone?: 'black' | 'maroon'
}

/** Dashboard balance sheet tile (single-row resource): big bold report type,
 *  feed type row, a white sub-tile pairing a circular stock-percent
 *  thermometer (max 100) with the stock type, and a second white sub-tile
 *  with the holdings table plus a bold total row. */
export interface BalanceSheetDTO {
  id: string
  reportType: string
  feedType: string
  stockType: string
  stockPercent: number
  holdings: BalanceSheetHoldingDTO[]
  totalType: string
  totalValue: string
}

/** Compensation breakdown (Total Comp page): rows of type/amount/percent
 *  with a teal thermometer, plus the total compensation figure. */
export interface CompBreakdownRowDTO {
  id: string
  compType: string
  compAmount: number
  compPercent: number
}

export interface CompBreakdownDTO {
  rows: CompBreakdownRowDTO[]
  totalComp: number
}

/** PLTR stock scenarios (Total Comp page): bear/current/bull mini tiles plus
 *  the disclosure note shown beneath them. */
export interface StockScenarioDTO {
  id: string
  stockType: string
  stockValue: number
  totalValue: number
}

export interface CompScenariosDTO {
  scenarios: StockScenarioDTO[]
  disclosureText: string
}

export interface UserDTO {
  displayName: string
}

export interface ApiErrorBody {
  error: string
}
