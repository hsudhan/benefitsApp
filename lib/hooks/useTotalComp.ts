'use client'

// Controller-side hook for the Total Comp page: composes the user,
// compensation, portfolio, quick-link, compensation-breakdown, and
// stock-scenario REST resources into one view contract.

import {
  fetchCompBreakdown,
  fetchCompScenarios,
  fetchCompTiles,
  fetchCurrentUser,
  fetchPortfolioTiles,
  fetchQuickLinks,
} from '@/lib/api-client'
import { useLogout } from '@/lib/hooks/useLogout'
import { useResources, type ResourceState } from '@/lib/hooks/useResources'
import type {
  CompBreakdownDTO,
  CompScenariosDTO,
  CompTileDTO,
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
}

export type TotalCompState = ResourceState<TotalCompData>

export function useTotalComp(): { state: TotalCompState; handleLogout: () => Promise<void> } {
  const state = useResources<TotalCompData>(async () => {
    const [user, comp, portfolio, quickLinks, breakdown, scenarios] = await Promise.all([
      fetchCurrentUser(),
      fetchCompTiles(),
      fetchPortfolioTiles(),
      fetchQuickLinks(),
      fetchCompBreakdown(),
      fetchCompScenarios(),
    ])
    return { user, comp, portfolio, quickLinks, breakdown, scenarios }
  })
  const handleLogout = useLogout()
  return { state, handleLogout }
}
