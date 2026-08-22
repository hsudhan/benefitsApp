// Controller: GET /api/benefits/portfolio

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getPortfolioTiles } from '@/lib/models/benefits/service'
import { requireAuthenticated } from '@/lib/session'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  return NextResponse.json(await getPortfolioTiles())
})
