'use client'

// Controller-side hook for the Total Comp page: composes the user,
// compensation, portfolio, quick-link, compensation-breakdown,
// stock-scenario, and financial-goals REST resources into one view contract.

import {
  fetchCompBreakdown,
  fetchCompScenarios,
  fetchCompTiles,
  fetchCurrentUser,
  fetchFinancialGoals,
  fetchPortfolioTiles,
  fetchQuickLinks,
} from '@/lib/api-client'
import { useLogout } from '@/lib/hooks/useLogout'
import { useResources, type ResourceState } from '@/lib/hooks/useResources'
import type {
  CompBreakdownDTO,
  CompScenariosDTO,
  CompTileDTO,
  FinancialGoalsDTO,
  PortfolioTileDTO,
  QuickLinkDTO,
  UserDTO,
} from '@/lib/types'

export interface TotalCompData {
  user: UserDTO
  comp: CompTileDTO[]
  portfolio: PortfolioTileDTO[]
  quickLinks: QuickLinkDTO[]
  breakdown: CompBreakdownDTO
  scenarios: CompScenariosDTO
  financialGoals: FinancialGoalsDTO
}

export type TotalCompState = ResourceState<TotalCompData>

export function useTotalComp(): { state: TotalCompState; handleLogout: () => Promise<void> } {
  const state = useResources<TotalCompData>(async () => {
    const [user, comp, portfolio, quickLinks, breakdown, scenarios, financialGoals] =
      await Promise.all([
        fetchCurrentUser(),
        fetchCompTiles(),
        fetchPortfolioTiles(),
        fetchQuickLinks(),
        fetchCompBreakdown(),
        fetchCompScenarios(),
        fetchFinancialGoals(),
      ])
    return { user, comp, portfolio, quickLinks, breakdown, scenarios, financialGoals }
  })
  const handleLogout = useLogout()
  return { state, handleLogout }
}
