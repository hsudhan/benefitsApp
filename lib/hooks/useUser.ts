'use client'

// Controller-side hook for pages that only need the signed-in user (header)
// and no tile resources — e.g. tabs the spec leaves blank.

import { fetchCurrentUser } from '@/lib/api-client'
import { useLogout } from '@/lib/hooks/useLogout'
import { useResources, type ResourceState } from '@/lib/hooks/useResources'
import type { UserDTO } from '@/lib/types'

export interface UserPageData {
  user: UserDTO
}

export type UserPageState = ResourceState<UserPageData>

export function useUser(): { state: UserPageState; handleLogout: () => Promise<void> } {
  const state = useResources<UserPageData>(async () => ({ user: await fetchCurrentUser() }))
  const handleLogout = useLogout()
  return { state, handleLogout }
}
