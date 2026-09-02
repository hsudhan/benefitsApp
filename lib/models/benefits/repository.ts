// Model layer: repository contract. Services depend only on this interface,
// so the persistence technology can change (mock today, SQL database
// tomorrow) without touching controllers, services, or the client.

import type {
  BalanceSheetDTO,
  BenefitTileDTO,
  CompBreakdownDTO,
  CompScenariosDTO,
  CompTileDTO,
  EquityReportDTO,
  FinancialGoalsDTO,
  HealthTileDTO,
  NetWorthTileDTO,
  PortfolioTileDTO,
  PriorityActionsDTO,
  QuickLinkDTO,
  RetirementTileDTO,
  TopQuestionsDTO,
} from '@/lib/types'

export interface BenefitsRepository {
  getSummaryTiles(): Promise<BenefitTileDTO[]>
  getPriorityActions(): Promise<PriorityActionsDTO>
  getTopQuestions(): Promise<TopQuestionsDTO>
  getCompTiles(): Promise<CompTileDTO[]>
  getPortfolioTiles(): Promise<PortfolioTileDTO[]>
  getQuickLinks(): Promise<QuickLinkDTO[]>
  getHealthTiles(): Promise<HealthTileDTO[]>
  getRetirementTiles(): Promise<RetirementTileDTO[]>
  getNetWorthTiles(): Promise<NetWorthTileDTO[]>
  getEquityReport(): Promise<EquityReportDTO>
  getBalanceSheet(): Promise<BalanceSheetDTO>
  getCompBreakdown(): Promise<CompBreakdownDTO>
  getCompScenarios(): Promise<CompScenariosDTO>
  getFinancialGoals(): Promise<FinancialGoalsDTO>
}
