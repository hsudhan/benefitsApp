// Postgres repository: database-backed implementation, selected when
// DATA_SOURCE=postgres (requires DATABASE_URL). Each DTO is served from its
// own table (see db/schema.sql), so queries map rows directly onto the
// contract. No other layer (services, controllers, client) changes.

import { Pool } from 'pg'
import type {
  BalanceSheetDTO,
  BenefitTileDTO,
  CompBreakdownDTO,
  CompBreakdownRowDTO,
  CompScenariosDTO,
  CompTileDTO,
  CompTileVariant,
  EquityGrantDTO,
  EquityReportDTO,
  FinancialGoalDTO,
  FinancialGoalsDTO,
  HealthTileDTO,
  NetWorthTileDTO,
  PortfolioTileDTO,
  PriorityActionDTO,
  PriorityActionsDTO,
  QuickLinkDTO,
  RetirementContributionDTO,
  RetirementTileDTO,
  RetirementTileVariant,
  StockScenarioDTO,
  TileVariant,
  TopQuestionDTO,
  TopQuestionsDTO,
  VestingEventDTO,
} from '@/lib/types'
import type { BenefitsRepository } from './repository'

// Row shapes for benefit_tiles and retirement_tiles: columns mirror the DTO
// fields (snake-cased), nullable columns correspond to optional DTO fields,
// and `amount` is string because pg returns NUMERIC unparsed to avoid
// precision loss. The other tables' columns match their DTOs exactly, so
// those queries type rows with the DTO types directly.
interface BenefitTileRow {
  id: string
  title: string
  variant: TileVariant
  amount: string | null
  description: string | null
  trend_direction: 'up' | 'down' | null
  trend_percent: number | null
  expiry_date: string | null
  date: string | null
}

interface RetirementTileRow {
  id: string
  title: string
  variant: RetirementTileVariant
  amount: string | null
  description: string | null
  trend_direction: 'up' | 'down' | null
  trend_percent: number | null
  expiry_date: string | null
  date: string | null
  contributed_amount: string | null
  irs_limit: string | null
  percent_spent: number | null
  info_category: string | null
  info_type: string | null
  info_description: string | null
  unvested_total_type: string | null
  unvested_shares_text: string | null
  unvested_shares_type: string | null
  unvested_value_type: string | null
  unvested_value_text: string | null
  unvested_price_type: string | null
}

interface RetirementContributionRow {
  tile_id: string
  contribution_percent: number
  contribution_amount: string
}

interface VestingEventRow {
  tile_id: string
  id: string
  vesting_date: string
  shares_text: string
  value_text: string
}

interface CompTileRow {
  id: string
  title: string
  variant: CompTileVariant
  amount: string | null
  description: string | null
  trend_direction: 'up' | 'down' | null
  trend_percent: number | null
  date: string | null
}

interface NetWorthTileRow {
  id: string
  title: string
  value_text: string
  description: string | null
  description_tone: 'plain' | 'green' | null
  tile_tone: 'white' | 'gray' | null
  action_label: string | null
  action_href: string | null
}

interface PriorityActionsRow {
  id: string
  actions_title: string
}

interface PriorityActionItemRow {
  id: string
  action_category: string
  action_title: string
  action_description: string
  action_label: string
  action_href: string
}

interface TopQuestionsRow {
  id: string
  questions_message: string
  subtext_type: string
}

interface TopQuestionItemRow {
  id: string
  question_text: string
  action_label: string
  action_href: string
}

interface EquityReportRow {
  id: string
  report_type: string
  feed_type: string
  equity_value_type: string
  equity_value: string | null
  equity_share_count: string | null
  share_account_type: string | null
  stock_type: string | null
  last_updated: string | null
}

interface EquityGrantRow {
  id: string
  shares_text: string
  value_text: string
  description: string
  status: 'VESTED' | 'UNVESTED'
}

interface BalanceSheetRow {
  id: string
  report_type: string
  feed_type: string
  stock_type: string
  stock_percent: number
  total_type: string
  total_value: string
}

interface BalanceSheetHoldingRow {
  id: string
  investment_type: string
  investment_value: string
  value_tone: 'black' | 'maroon' | null
}

interface FinancialGoalsRow {
  id: string
  financial_goals_tile_title: string
  action_label: string
  action_href: string
}

interface FinancialGoalItemRow {
  id: string
  shares_type: string
  share_description: string
  goal_date: string
}

interface CompBreakdownRowRecord {
  id: string
  comp_type: string
  comp_amount: string
  comp_percent: string
}

interface StockScenarioRow {
  id: string
  stock_type: string
  stock_value: string
  total_value: string
}

function toBenefitTileDTO(row: BenefitTileRow): BenefitTileDTO {
  return {
    id: row.id,
    title: row.title,
    variant: row.variant,
    amount: row.amount === null ? undefined : Number(row.amount),
    description: row.description ?? undefined,
    trendDirection: row.trend_direction ?? undefined,
    trendPercent: row.trend_percent ?? undefined,
    expiryDate: row.expiry_date ?? undefined,
    date: row.date ?? undefined,
  }
}

function toRetirementTileDTO(
  row: RetirementTileRow,
  contributions?: RetirementContributionDTO[],
  vestingEvents?: VestingEventDTO[]
): RetirementTileDTO {
  return {
    id: row.id,
    title: row.title,
    variant: row.variant,
    amount: row.amount === null ? undefined : Number(row.amount),
    description: row.description ?? undefined,
    trendDirection: row.trend_direction ?? undefined,
    trendPercent: row.trend_percent ?? undefined,
    expiryDate: row.expiry_date ?? undefined,
    date: row.date ?? undefined,
    contributions,
    contributedAmount:
      row.contributed_amount === null ? undefined : Number(row.contributed_amount),
    irsLimit: row.irs_limit === null ? undefined : Number(row.irs_limit),
    percentSpent: row.percent_spent ?? undefined,
    infoCategory: row.info_category ?? undefined,
    infoType: row.info_type ?? undefined,
    infoDescription: row.info_description ?? undefined,
    unvestedTotalType: row.unvested_total_type ?? undefined,
    unvestedSharesText: row.unvested_shares_text ?? undefined,
    unvestedSharesType: row.unvested_shares_type ?? undefined,
    unvestedValueType: row.unvested_value_type ?? undefined,
    unvestedValueText: row.unvested_value_text ?? undefined,
    unvestedPriceType: row.unvested_price_type ?? undefined,
    vestingEvents,
  }
}

function toCompTileDTO(row: CompTileRow): CompTileDTO {
  return {
    id: row.id,
    title: row.title,
    variant: row.variant,
    amount: row.amount === null ? undefined : Number(row.amount),
    description: row.description ?? undefined,
    trendDirection: row.trend_direction ?? undefined,
    trendPercent: row.trend_percent ?? undefined,
    date: row.date ?? undefined,
  }
}

function toNetWorthTileDTO(row: NetWorthTileRow): NetWorthTileDTO {
  return {
    id: row.id,
    title: row.title,
    valueText: row.value_text,
    description: row.description ?? undefined,
    descriptionTone: row.description_tone ?? undefined,
    tileTone: row.tile_tone ?? undefined,
    actionLabel: row.action_label ?? undefined,
    actionHref: row.action_href ?? undefined,
  }
}

function toCompBreakdownRowDTO(row: CompBreakdownRowRecord): CompBreakdownRowDTO {
  return {
    id: row.id,
    compType: row.comp_type,
    compAmount: Number(row.comp_amount),
    compPercent: Number(row.comp_percent),
  }
}

function toStockScenarioDTO(row: StockScenarioRow): StockScenarioDTO {
  return {
    id: row.id,
    stockType: row.stock_type,
    stockValue: Number(row.stock_value),
    totalValue: Number(row.total_value),
  }
}

export class PostgresBenefitsRepository implements BenefitsRepository {
  private readonly pool: Pool

  constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl })
    // Idle-client errors must not escape as unhandled rejections.
    this.pool.on('error', (error) => {
      console.error('Unexpected Postgres pool error:', error)
    })
  }

  async getSummaryTiles(): Promise<BenefitTileDTO[]> {
    const { rows } = await this.pool.query<BenefitTileRow>(
      `SELECT id, title, variant, amount, description,
              trend_direction, trend_percent, expiry_date, date
         FROM benefit_tiles
        ORDER BY position`
    )
    return rows.map(toBenefitTileDTO)
  }

  async getPriorityActions(): Promise<PriorityActionsDTO> {
    const { rows } = await this.pool.query<PriorityActionsRow>(
      `SELECT id, actions_title
         FROM priority_actions
        ORDER BY id
        LIMIT 1`
    )
    const row = rows[0]
    const { rows: actionRows } = await this.pool.query<PriorityActionItemRow>(
      `SELECT id, action_category, action_title, action_description,
              action_label, action_href
         FROM priority_action_items
        WHERE priority_actions_id = $1
        ORDER BY position`,
      [row.id]
    )
    const actions: PriorityActionDTO[] = actionRows.map((action) => ({
      id: action.id,
      actionCategory: action.action_category,
      actionTitle: action.action_title,
      actionDescription: action.action_description,
      actionLabel: action.action_label,
      actionHref: action.action_href,
    }))
    return { id: row.id, actionsTitle: row.actions_title, actions }
  }

  async getTopQuestions(): Promise<TopQuestionsDTO> {
    const { rows } = await this.pool.query<TopQuestionsRow>(
      `SELECT id, questions_message, subtext_type
         FROM top_questions
        ORDER BY id
        LIMIT 1`
    )
    const row = rows[0]
    const { rows: questionRows } = await this.pool.query<TopQuestionItemRow>(
      `SELECT id, question_text, action_label, action_href
         FROM top_question_items
        WHERE top_questions_id = $1
        ORDER BY position`,
      [row.id]
    )
    const questions: TopQuestionDTO[] = questionRows.map((question) => ({
      id: question.id,
      questionText: question.question_text,
      actionLabel: question.action_label,
      actionHref: question.action_href,
    }))
    return {
      id: row.id,
      questionsMessage: row.questions_message,
      subtextType: row.subtext_type,
      questions,
    }
  }

  async getRetirementTiles(): Promise<RetirementTileDTO[]> {
    const { rows } = await this.pool.query<RetirementTileRow>(
      `SELECT id, title, variant, amount, description,
              trend_direction, trend_percent, expiry_date, date,
              contributed_amount, irs_limit, percent_spent,
              info_category, info_type, info_description,
              unvested_total_type, unvested_shares_text, unvested_shares_type,
              unvested_value_type, unvested_value_text, unvested_price_type
         FROM retirement_tiles
        ORDER BY position`
    )
    const { rows: contributionRows } = await this.pool.query<RetirementContributionRow>(
      `SELECT tile_id, contribution_percent, contribution_amount
         FROM retirement_contributions
        ORDER BY position`
    )
    const contributionsByTile = new Map<string, RetirementContributionDTO[]>()
    for (const row of contributionRows) {
      const contributions = contributionsByTile.get(row.tile_id) ?? []
      contributions.push({
        contributionPercent: row.contribution_percent,
        contributionAmount: Number(row.contribution_amount),
      })
      contributionsByTile.set(row.tile_id, contributions)
    }
    const { rows: vestingRows } = await this.pool.query<VestingEventRow>(
      `SELECT tile_id, id, vesting_date, shares_text, value_text
         FROM retirement_vesting_events
        ORDER BY position`
    )
    const vestingEventsByTile = new Map<string, VestingEventDTO[]>()
    for (const row of vestingRows) {
      const events = vestingEventsByTile.get(row.tile_id) ?? []
      events.push({
        id: row.id,
        vestingDate: row.vesting_date,
        sharesText: row.shares_text,
        valueText: row.value_text,
      })
      vestingEventsByTile.set(row.tile_id, events)
    }
    return rows.map((row) =>
      toRetirementTileDTO(row, contributionsByTile.get(row.id), vestingEventsByTile.get(row.id))
    )
  }

  async getCompTiles(): Promise<CompTileDTO[]> {
    const { rows } = await this.pool.query<CompTileRow>(
      `SELECT id, title, variant, amount, description,
              trend_direction, trend_percent, date
         FROM comp_tiles
        ORDER BY position`
    )
    return rows.map(toCompTileDTO)
  }

  async getPortfolioTiles(): Promise<PortfolioTileDTO[]> {
    const { rows } = await this.pool.query<PortfolioTileDTO>(
      'SELECT id, title, description FROM portfolio_tiles ORDER BY position'
    )
    return rows
  }

  async getQuickLinks(): Promise<QuickLinkDTO[]> {
    const { rows } = await this.pool.query<QuickLinkDTO>(
      'SELECT label, href FROM quick_links ORDER BY position'
    )
    return rows
  }

  async getHealthTiles(): Promise<HealthTileDTO[]> {
    const { rows } = await this.pool.query<HealthTileDTO>(
      `SELECT id, title, status, description, utilization, stat
         FROM health_tiles
        ORDER BY position`
    )
    return rows
  }

  async getNetWorthTiles(): Promise<NetWorthTileDTO[]> {
    const { rows } = await this.pool.query<NetWorthTileRow>(
      `SELECT id, title, value_text, description, description_tone,
              tile_tone, action_label, action_href
         FROM networth_tiles
        ORDER BY position`
    )
    return rows.map(toNetWorthTileDTO)
  }

  async getEquityReport(): Promise<EquityReportDTO> {
    const { rows } = await this.pool.query<EquityReportRow>(
      `SELECT id, report_type, feed_type, equity_value_type, equity_value,
              equity_share_count, share_account_type, stock_type, last_updated
         FROM equity_report
        ORDER BY id
        LIMIT 1`
    )
    const row = rows[0]
    const { rows: grantRows } = await this.pool.query<EquityGrantRow>(
      `SELECT id, shares_text, value_text, description, status
         FROM equity_grants
        WHERE equity_report_id = $1
        ORDER BY position`,
      [row.id]
    )
    const grants: EquityGrantDTO[] = grantRows.map((grant) => ({
      id: grant.id,
      sharesText: grant.shares_text,
      valueText: grant.value_text,
      description: grant.description,
      status: grant.status,
    }))
    return {
      id: row.id,
      reportType: row.report_type,
      feedType: row.feed_type,
      equityValueType: row.equity_value_type,
      equityValue: row.equity_value ?? undefined,
      equityShareCount: row.equity_share_count ?? undefined,
      shareAccountType: row.share_account_type ?? undefined,
      grants,
      stockType: row.stock_type ?? undefined,
      lastUpdated: row.last_updated ?? undefined,
    }
  }

  async getBalanceSheet(): Promise<BalanceSheetDTO> {
    const { rows } = await this.pool.query<BalanceSheetRow>(
      `SELECT id, report_type, feed_type, stock_type, stock_percent,
              total_type, total_value
         FROM balance_sheet
        ORDER BY id
        LIMIT 1`
    )
    const row = rows[0]
    const { rows: holdingRows } = await this.pool.query<BalanceSheetHoldingRow>(
      `SELECT id, investment_type, investment_value, value_tone
         FROM balance_sheet_holdings
        WHERE balance_sheet_id = $1
        ORDER BY position`,
      [row.id]
    )
    return {
      id: row.id,
      reportType: row.report_type,
      feedType: row.feed_type,
      stockType: row.stock_type,
      stockPercent: row.stock_percent,
      holdings: holdingRows.map((holding) => ({
        id: holding.id,
        investmentType: holding.investment_type,
        investmentValue: holding.investment_value,
        valueTone: holding.value_tone ?? undefined,
      })),
      totalType: row.total_type,
      totalValue: row.total_value,
    }
  }

  async getCompBreakdown(): Promise<CompBreakdownDTO> {
    const { rows } = await this.pool.query<CompBreakdownRowRecord>(
      `SELECT id, comp_type, comp_amount, comp_percent
         FROM comp_breakdown
        ORDER BY position`
    )
    const { rows: totalRows } = await this.pool.query<{ total_comp: string }>(
      `SELECT total_comp FROM comp_breakdown_total ORDER BY id LIMIT 1`
    )
    return {
      rows: rows.map(toCompBreakdownRowDTO),
      totalComp: Number(totalRows[0]?.total_comp ?? 0),
    }
  }

  async getCompScenarios(): Promise<CompScenariosDTO> {
    const { rows } = await this.pool.query<StockScenarioRow>(
      `SELECT id, stock_type, stock_value, total_value
         FROM stock_scenarios
        ORDER BY position`
    )
    const { rows: disclosureRows } = await this.pool.query<{ disclosure_text: string }>(
      `SELECT disclosure_text FROM comp_disclosure ORDER BY id LIMIT 1`
    )
    return {
      scenarios: rows.map(toStockScenarioDTO),
      disclosureText: disclosureRows[0]?.disclosure_text ?? '',
    }
  }

  async getFinancialGoals(): Promise<FinancialGoalsDTO> {
    const { rows } = await this.pool.query<FinancialGoalsRow>(
      `SELECT id, financial_goals_tile_title, action_label, action_href
         FROM financial_goals
        ORDER BY id
        LIMIT 1`
    )
    const row = rows[0]
    const { rows: goalRows } = await this.pool.query<FinancialGoalItemRow>(
      `SELECT id, shares_type, share_description, goal_date
         FROM financial_goal_items
        WHERE financial_goals_id = $1
        ORDER BY position`,
      [row.id]
    )
    const goals: FinancialGoalDTO[] = goalRows.map((goal) => ({
      id: goal.id,
      sharesType: goal.shares_type,
      shareDescription: goal.share_description,
      goalDate: goal.goal_date,
    }))
    return {
      id: row.id,
      financialGoalsTileTitle: row.financial_goals_tile_title,
      actionLabel: row.action_label,
      actionHref: row.action_href,
      goals,
    }
  }
}
