'use client'

// Controller-side hook: shared logout flow — always lands on /login, even if
// the logout request itself fails.

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/api-client'

export function useLogout(): () => Promise<void> {
  const router = useRouter()
  return useCallback(async () => {
    try {
      await logout()
    } finally {
      router.push('/login')
    }
  }, [router])
}
