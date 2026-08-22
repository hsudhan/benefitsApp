// Controller: GET /api/benefits/retirement

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getRetirementTiles } from '@/lib/models/benefits/service'
import { requireAuthenticated } from '@/lib/session'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  return NextResponse.json(await getRetirementTiles())
})
