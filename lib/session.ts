// Model: session management. Cookie name and lifetime come from validated
// configuration — nothing is hardcoded at call sites.

import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { getConfig } from '@/lib/config'
import { HttpError } from '@/lib/http'

// Internal protocol constant marking an active session (not configuration).
const SESSION_ACTIVE_VALUE = 'authenticated'

const UNAUTHORIZED = 401

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return store.get(getConfig().sessionCookieName)?.value === SESSION_ACTIVE_VALUE
}

/** Guard for controllers: throws HttpError(401) unless a session exists.
 *  Centralized error handling turns it into a JSON 401 response. */
export async function requireAuthenticated(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new HttpError(UNAUTHORIZED, 'Unauthorized')
  }
}

export function createSession(response: NextResponse): void {
  const config = getConfig()
  response.cookies.set(config.sessionCookieName, SESSION_ACTIVE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: config.sessionMaxAgeSeconds,
  })
}

export function destroySession(response: NextResponse): void {
  response.cookies.set(getConfig().sessionCookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
