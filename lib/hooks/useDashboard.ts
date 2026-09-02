'use client'

// Controller-side hook for the Dashboard page: composes the user, net-worth,
// portfolio, quick-link, and equity-report REST resources into one view
// contract.

import {
  fetchBalanceSheet,
  fetchCurrentUser,
  fetchEquityReport,
  fetchNetWorthTiles,
  fetchPortfolioTiles,
  fetchPriorityActions,
  fetchQuickLinks,
  fetchTopQuestions,
} from '@/lib/api-client'
import { useLogout } from '@/lib/hooks/useLogout'
import { useResources, type ResourceState } from '@/lib/hooks/useResources'
import type {
  BalanceSheetDTO,
  EquityReportDTO,
  NetWorthTileDTO,
  PortfolioTileDTO,
  PriorityActionsDTO,
  QuickLinkDTO,
  TopQuestionsDTO,
  UserDTO,
} from '@/lib/types'

export interface DashboardData {
  user: UserDTO
  priorityActions: PriorityActionsDTO
  topQuestions: TopQuestionsDTO
  networth: NetWorthTileDTO[]
  portfolio: PortfolioTileDTO[]
  quickLinks: QuickLinkDTO[]
  equityReport: EquityReportDTO
  balanceSheet: BalanceSheetDTO
}

export type DashboardState = ResourceState<DashboardData>

export function useDashboard(): { state: DashboardState; handleLogout: () => Promise<void> } {
  const state = useResources<DashboardData>(async () => {
    const [user, priorityActions, topQuestions, networth, portfolio, quickLinks, equityReport, balanceSheet] =
      await Promise.all([
        fetchCurrentUser(),
        fetchPriorityActions(),
        fetchTopQuestions(),
        fetchNetWorthTiles(),
        fetchPortfolioTiles(),
        fetchQuickLinks(),
        fetchEquityReport(),
        fetchBalanceSheet(),
      ])
    return { user, priorityActions, topQuestions, networth, portfolio, quickLinks, equityReport, balanceSheet }
  })
  const handleLogout = useLogout()
  return { state, handleLogout }
}
