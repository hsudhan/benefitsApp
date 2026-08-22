// Repository factory: picks the persistence implementation from validated
// configuration. This is the single seam where the mock-to-database switch
// happens (DATA_SOURCE env var).

import { getConfig } from '@/lib/config'
import { MockBenefitsRepository } from './mock'
import { PostgresBenefitsRepository } from './postgres'
import type { BenefitsRepository } from './repository'

let instance: BenefitsRepository | null = null

export function getBenefitsRepository(): BenefitsRepository {
  if (instance) {
    return instance
  }
  const config = getConfig()
  switch (config.dataSource) {
    case 'postgres':
      instance = new PostgresBenefitsRepository(config.databaseUrl as string)
      break
    case 'mock':
    default:
      instance = new MockBenefitsRepository()
  }
  return instance
}

export type { BenefitsRepository } from './repository'
