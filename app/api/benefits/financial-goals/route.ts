// Controller: GET /api/benefits/financial-goals

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getFinancialGoals } from '@/lib/models/benefits/service'
import { requireAuthenticated } from '@/lib/session'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  return NextResponse.json(await getFinancialGoals())
})
