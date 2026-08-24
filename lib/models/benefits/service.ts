// Service layer: business entry points used by the REST controllers.
// Controllers never touch repositories directly; services never touch
// request/response objects. This keeps every layer independently replaceable.

import type {
  BalanceSheetDTO,
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
import { getBenefitsRepository } from './index'

export async function getSummaryTiles(): Promise<BenefitTileDTO[]> {
  return getBenefitsRepository().getSummaryTiles()
}

export async function getCompTiles(): Promise<CompTileDTO[]> {
  return getBenefitsRepository().getCompTiles()
}

export async function getPortfolioTiles(): Promise<PortfolioTileDTO[]> {
  return getBenefitsRepository().getPortfolioTiles()
}

export async function getQuickLinks(): Promise<QuickLinkDTO[]> {
  return getBenefitsRepository().getQuickLinks()
}

export async function getHealthTiles(): Promise<HealthTileDTO[]> {
  return getBenefitsRepository().getHealthTiles()
}

export async function getRetirementTiles(): Promise<RetirementTileDTO[]> {
  return getBenefitsRepository().getRetirementTiles()
}

export async function getNetWorthTiles(): Promise<NetWorthTileDTO[]> {
  return getBenefitsRepository().getNetWorthTiles()
}

export async function getEquityReport(): Promise<EquityReportDTO> {
  return getBenefitsRepository().getEquityReport()
}

export async function getBalanceSheet(): Promise<BalanceSheetDTO> {
  return getBenefitsRepository().getBalanceSheet()
}

export async function getCompBreakdown(): Promise<CompBreakdownDTO> {
  return getBenefitsRepository().getCompBreakdown()
}

export async function getCompScenarios(): Promise<CompScenariosDTO> {
  return getBenefitsRepository().getCompScenarios()
}
