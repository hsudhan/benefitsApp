// Server-only configuration. All configuration values, secrets, and magic
// numbers come from environment variables and are validated here at the
// entry point — nowhere else in the codebase reads process.env.

export type DataSource = 'mock' | 'postgres'

export interface AppConfig {
  demoUsername: string
  demoPassword: string
  demoUserDisplayName: string
  sessionCookieName: string
  sessionMaxAgeSeconds: number
  /** Which repository backs the model layer: 'mock' today, 'postgres' when
   *  the database is provisioned. */
  dataSource: DataSource
  /** Connection string for the future database. Required when
   *  DATA_SOURCE=postgres. */
  databaseUrl?: string
}

const DEFAULT_SESSION_COOKIE_NAME = 'benefits_session'
const DEFAULT_SESSION_MAX_AGE_SECONDS = '28800'
const DEFAULT_DISPLAY_NAME = 'Demo User'
const DEFAULT_DATA_SOURCE = 'mock'
const KNOWN_DATA_SOURCES: readonly DataSource[] = ['mock', 'postgres']

let cached: AppConfig | null = null

export function getConfig(): AppConfig {
  if (cached) {
    return cached
  }
  if (typeof window !== 'undefined') {
    throw new Error('lib/config is server-only and must not be imported by client code')
  }

  const missing: string[] = []
  const required = (key: string): string => {
    const value = process.env[key]
    if (!value) {
      missing.push(key)
      return ''
    }
    return value
  }

  const demoUsername = required('DEMO_USERNAME')
  const demoPassword = required('DEMO_PASSWORD')

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. See .env.example.`
    )
  }

  const sessionMaxAgeSeconds = Number(
    process.env.SESSION_MAX_AGE_SECONDS ?? DEFAULT_SESSION_MAX_AGE_SECONDS
  )
  if (!Number.isInteger(sessionMaxAgeSeconds) || sessionMaxAgeSeconds <= 0) {
    throw new Error('SESSION_MAX_AGE_SECONDS must be a positive integer')
  }

  const dataSource = (process.env.DATA_SOURCE ?? DEFAULT_DATA_SOURCE) as DataSource
  if (!KNOWN_DATA_SOURCES.includes(dataSource)) {
    throw new Error(
      `DATA_SOURCE must be one of: ${KNOWN_DATA_SOURCES.join(', ')}. Got "${dataSource}".`
    )
  }

  const databaseUrl = process.env.DATABASE_URL
  if (dataSource === 'postgres' && !databaseUrl) {
    throw new Error('DATABASE_URL is required when DATA_SOURCE=postgres')
  }

  cached = {
    demoUsername,
    demoPassword,
    demoUserDisplayName: process.env.DEMO_USER_DISPLAY_NAME ?? DEFAULT_DISPLAY_NAME,
    sessionCookieName: process.env.SESSION_COOKIE_NAME ?? DEFAULT_SESSION_COOKIE_NAME,
    sessionMaxAgeSeconds,
    dataSource,
    databaseUrl,
  }
  return cached
}
