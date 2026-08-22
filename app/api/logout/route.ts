// Controller: POST /api/logout — destroys the session.

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { destroySession } from '@/lib/session'

export const POST = withErrorHandling(async () => {
  const response = NextResponse.json({ ok: true })
  destroySession(response)
  return response
})
