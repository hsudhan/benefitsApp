// Controller: GET /api/benefits/networth

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getNetWorthTiles } from '@/lib/models/benefits/service'
import { requireAuthenticated } from '@/lib/session'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  return NextResponse.json(await getNetWorthTiles())
})
