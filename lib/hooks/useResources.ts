'use client'

// Controller-side hook: generic fetch lifecycle shared by every page hook.
// Owns the loading/error/ready state machine so views only render states;
// a 401 from any API redirects to the login page.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiRequestError } from '@/lib/api-client'

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T }

const UNAUTHORIZED = 401

/** Runs `load` once on mount. `load` composes REST resources into the page's
 *  view contract; it is intentionally not a dependency (call sites pass an
 *  inline closure) so the fetch runs exactly once per page mount. */
export function useResources<T>(load: () => Promise<T>): ResourceState<T> {
  const router = useRouter()
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const data = await load()
        if (!cancelled) {
          setState({ status: 'ready', data })
        }
      } catch (error) {
        if (cancelled) {
          return
        }
        if (error instanceof ApiRequestError && error.status === UNAUTHORIZED) {
          router.push('/login')
          return
        }
        setState({ status: 'error', message: 'Unable to load your benefits right now.' })
      }
    }

    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return state
}
