// Controller: GET /api/users/me — the authenticated user's profile.

import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/http'
import { getCurrentUser } from '@/lib/models/users'
import { requireAuthenticated } from '@/lib/session'
import type { UserDTO } from '@/lib/types'

export const GET = withErrorHandling(async () => {
  await requireAuthenticated()
  const user = await getCurrentUser()
  const body: UserDTO = { displayName: user.displayName }
  return NextResponse.json(body)
})
