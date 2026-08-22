// Model layer: repository contract. Services depend only on this interface,
// so the persistence technology can change (mock today, SQL database
// tomorrow) without touching controllers, services, or the client.

import type {
  BenefitTileDTO,
  CompBreakdownDTO,
  CompScenariosDTO,
  CompTileDTO,
  EquityReportDTO,
  HealthTileDTO,
  NetWorthTileDTO,
  PortfolioTileDTO,
  QuickLinkDTO,
  RetirementTileDTO,
} from '@/lib/types'

export interface BenefitsRepository {
  getSummaryTiles(): Promise<BenefitTileDTO[]>
  getCompTiles(): Promise<CompTileDTO[]>
  getPortfolioTiles(): Promise<PortfolioTileDTO[]>
  getQuickLinks(): Promise<QuickLinkDTO[]>
  getHealthTiles(): Promise<HealthTileDTO[]>
  getRetirementTiles(): Promise<RetirementTileDTO[]>
  getNetWorthTiles(): Promise<NetWorthTileDTO[]>
  getEquityReport(): Promise<EquityReportDTO>
  getCompBreakdown(): Promise<CompBreakdownDTO>
  getCompScenarios(): Promise<CompScenariosDTO>
}
