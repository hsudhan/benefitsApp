// Controller: POST /api/login — validates the payload, delegates credential
// verification to the users model, and establishes a session.

import { NextResponse } from 'next/server'
import { parseJsonBody, requireString, withErrorHandling } from '@/lib/http'
import { verifyCredentials } from '@/lib/models/users'
import { createSession } from '@/lib/session'

export const POST = withErrorHandling(async (request: Request) => {
  const body = await parseJsonBody(request)
  const username = requireString(body, 'username')
  const password = requireString(body, 'password')

  const user = await verifyCredentials(username, password)
  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  createSession(response)
  return response
})
