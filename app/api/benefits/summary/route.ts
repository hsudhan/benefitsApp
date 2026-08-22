// Controller: GET /api/benefits/summary

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getSummaryTiles } from '@/lib/models/benefits/service'
import { requireAuthenticated } from '@/lib/session'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  return NextResponse.json(await getSummaryTiles())
})
