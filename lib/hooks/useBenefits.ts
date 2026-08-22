'use client'

// Controller-side hook for the Benefits page: composes the user, summary,
// portfolio, quick-link, health, and retirement REST resources into one view
// contract.

import {
  fetchCurrentUser,
  fetchHealthTiles,
  fetchPortfolioTiles,
  fetchQuickLinks,
  fetchRetirementTiles,
  fetchSummaryTiles,
} from '@/lib/api-client'
import { useLogout } from '@/lib/hooks/useLogout'
import { useResources, type ResourceState } from '@/lib/hooks/useResources'
import type {
  BenefitTileDTO,
  HealthTileDTO,
  PortfolioTileDTO,
  QuickLinkDTO,
  RetirementTileDTO,
  UserDTO,
} from '@/lib/types'

export interface BenefitsData {
  user: UserDTO
  summary: BenefitTileDTO[]
  portfolio: PortfolioTileDTO[]
  quickLinks: QuickLinkDTO[]
  health: HealthTileDTO[]
  retirement: RetirementTileDTO[]
}

export type BenefitsState = ResourceState<BenefitsData>

export function useBenefits(): { state: BenefitsState; handleLogout: () => Promise<void> } {
  const state = useResources<BenefitsData>(async () => {
    const [user, summary, portfolio, quickLinks, health, retirement] = await Promise.all([
      fetchCurrentUser(),
      fetchSummaryTiles(),
      fetchPortfolioTiles(),
      fetchQuickLinks(),
      fetchHealthTiles(),
      fetchRetirementTiles(),
    ])
    return { user, summary, portfolio, quickLinks, health, retirement }
  })
  const handleLogout = useLogout()
  return { state, handleLogout }
}
