// Model: user identity. Credentials come from validated configuration
// (environment), never hardcoded. In production this would be backed by an
// identity provider.

import { getConfig } from '@/lib/config'

export interface User {
  username: string
  displayName: string
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<User | null> {
  const config = getConfig()
  if (username === config.demoUsername && password === config.demoPassword) {
    return { username: config.demoUsername, displayName: config.demoUserDisplayName }
  }
  return null
}

export async function getCurrentUser(): Promise<User> {
  const config = getConfig()
  return { username: config.demoUsername, displayName: config.demoUserDisplayName }
}
