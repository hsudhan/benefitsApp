// Controller: GET /api/benefits/priority-actions

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getPriorityActions } from '@/lib/models/benefits/service'
import { requireAuthenticated } from '@/lib/session'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  return NextResponse.json(await getPriorityActions())
})
