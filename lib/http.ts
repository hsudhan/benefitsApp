// Controller infrastructure: centralized error handling and payload
// validation. Every route handler is wrapped with `withErrorHandling` so no
// rejection escapes unhandled, and all incoming payloads are validated at
// the entry point before touching models.

import { NextResponse } from 'next/server'
import type { ApiErrorBody } from '@/lib/types'

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

function jsonError(message: string, status: number): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: message }, { status })
}

type RouteHandler = (request: Request) => Promise<NextResponse>

/** Centralized error-handling wrapper for all route handlers. */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error) {
      if (error instanceof HttpError) {
        return jsonError(error.message, error.status)
      }
      console.error('Unhandled route error:', error)
      return jsonError('Internal server error', 500)
    }
  }
}

/** Parse a JSON request body, rejecting malformed payloads. */
export async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new HttpError(400, 'Invalid request body')
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'Invalid request body')
  }
  return body as Record<string, unknown>
}

/** Validate a required non-empty string field on a parsed payload. */
export function requireString(body: Record<string, unknown>, field: string): string {
  const value = body[field]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `Missing or invalid field: ${field}`)
  }
  return value
}
