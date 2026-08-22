// Client-side REST client. The view layer talks to the server exclusively
// through these functions over HTTP/JSON — it has no knowledge of models,
// services, or repositories on the server.

import type {
  ApiErrorBody,
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
  UserDTO,
} from '@/lib/types'

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  if (!response.ok) {
    let message = 'Request failed'
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) {
        message = body.error
      }
    } catch {
      // Keep the generic message when the error body is not JSON.
    }
    throw new ApiRequestError(response.status, message)
  }
  return (await response.json()) as T
}

export function login(username: string, password: string): Promise<{ ok: true }> {
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export function logout(): Promise<{ ok: true }> {
  return request('/api/logout', { method: 'POST' })
}

export function fetchCurrentUser(): Promise<UserDTO> {
  return request('/api/users/me')
}

export function fetchSummaryTiles(): Promise<BenefitTileDTO[]> {
  return request('/api/benefits/summary')
}

export function fetchCompTiles(): Promise<CompTileDTO[]> {
  return request('/api/benefits/compensation')
}

export function fetchPortfolioTiles(): Promise<PortfolioTileDTO[]> {
  return request('/api/benefits/portfolio')
}

export function fetchQuickLinks(): Promise<QuickLinkDTO[]> {
  return request('/api/benefits/quick-links')
}

export function fetchHealthTiles(): Promise<HealthTileDTO[]> {
  return request('/api/benefits/health')
}

export function fetchRetirementTiles(): Promise<RetirementTileDTO[]> {
  return request('/api/benefits/retirement')
}

export function fetchNetWorthTiles(): Promise<NetWorthTileDTO[]> {
  return request('/api/benefits/networth')
}

export function fetchEquityReport(): Promise<EquityReportDTO> {
  return request('/api/benefits/equity-report')
}

export function fetchCompBreakdown(): Promise<CompBreakdownDTO> {
  return request('/api/benefits/comp-breakdown')
}

export function fetchCompScenarios(): Promise<CompScenariosDTO> {
  return request('/api/benefits/stock-scenarios')
}
