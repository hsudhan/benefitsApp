'use client'

// View: Benefits page. All data arrives over the REST API via the useBenefits
// hook; DTOs are mapped to view-models by presenters. This component contains
// no data access and no business logic. Sections render inline, stacked in
// spec order: Benefits, Quick Actions, Health & Wellness, Retirement & Equity.
// The page renders inside the shared PageShell: a 70%-width center panel
// flanked by 15%-width gray side panels.

import AppHeader from '@/components/AppHeader'
import PageShell from '@/components/PageShell'
import DraggableTileGrid from '@/components/DraggableTileGrid'
import BenefitTile from '@/components/tiles/BenefitTile'
import HealthTile from '@/components/tiles/HealthTile'
import PortfolioTile from '@/components/tiles/PortfolioTile'
import RetirementTile from '@/components/tiles/RetirementTile'
import { useBenefits } from '@/lib/hooks/useBenefits'
import {
  toBenefitTileView,
  toHealthTileView,
  toPortfolioTileView,
  toRetirementTileView,
} from '@/lib/presenters'
import styles from './AppPage.module.css'

const SECTION_COPY = {
  benefits: { title: 'Benefits' },
  quickActions: { title: 'Quick Actions' },
  health: { title: 'Health & Wellness' },
  retirement: { title: 'Retirement & Equity' },
} as const

export default function Benefits() {
  const { state, handleLogout } = useBenefits()

  if (state.status === 'loading') {
    return (
      <PageShell>
        <div className={styles.statusPage}>Loading your benefits…</div>
      </PageShell>
    )
  }
  if (state.status === 'error') {
    return (
      <PageShell>
        <div className={styles.statusPage} role="alert">
          {state.message}
        </div>
      </PageShell>
    )
  }

  const { data } = state

  return (
    <PageShell>
      <AppHeader displayName={data.user.displayName} onLogout={handleLogout} />

      <main className={styles.pageMain}>
        <section aria-label="Benefits summary">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.benefits.title}</h2>
          <DraggableTileGrid
            items={data.summary}
            className={`${styles.tileGrid} ${styles.cols4}`}
            renderItem={(tile) => <BenefitTile tile={toBenefitTileView(tile)} />}
          />
        </section>

        <section aria-label="Quick actions">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.quickActions.title}</h2>
          <DraggableTileGrid
            items={data.portfolio}
            className={`${styles.tileGrid} ${styles.cols4}`}
            renderItem={(tile) => <PortfolioTile tile={toPortfolioTileView(tile)} />}
          />
          <nav className={styles.quickLinks} aria-label="Quick action links">
            {data.quickLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.quickLink}>
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        <section aria-label="Health and wellness benefits">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.health.title}</h2>
          <DraggableTileGrid
            items={data.health}
            className={`${styles.tileGrid} ${styles.cols3}`}
            renderItem={(tile) => <HealthTile tile={toHealthTileView(tile)} />}
          />
        </section>

        <section aria-label="Retirement and equity programs">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.retirement.title}</h2>
          <DraggableTileGrid
            items={data.retirement}
            className={`${styles.tileGrid} ${styles.cols2}`}
            renderItem={(tile) => <RetirementTile tile={toRetirementTileView(tile)} />}
          />
        </section>
      </main>
    </PageShell>
  )
}
