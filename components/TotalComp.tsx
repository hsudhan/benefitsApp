'use client'

// View: Total Comp page. All data arrives over the REST API via the
// useTotalComp hook; DTOs are mapped to view-models by presenters. This
// component contains no data access and no business logic. Sections render
// inline: Total Compensation, Quick Actions, Compensation Breakdown. The
// page renders inside the shared PageShell: a 70%-width center panel
// flanked by 15%-width gray side panels.

import AppHeader from '@/components/AppHeader'
import PageShell from '@/components/PageShell'
import DraggableTileGrid from '@/components/DraggableTileGrid'
import BenefitTile from '@/components/tiles/BenefitTile'
import PortfolioTile from '@/components/tiles/PortfolioTile'
import CompBreakdownTile from '@/components/tiles/CompBreakdownTile'
import StockScenariosTile from '@/components/tiles/StockScenariosTile'
import { useTotalComp } from '@/lib/hooks/useTotalComp'
import {
  toCompBreakdownView,
  toCompScenariosView,
  toCompTileView,
  toPortfolioTileView,
} from '@/lib/presenters'
import styles from './AppPage.module.css'

const SECTION_COPY = {
  compensation: { title: 'Total Compensation' },
  quickActions: { title: 'Quick Actions' },
  breakdown: { title: 'Compensation Breakdown' },
} as const

export default function TotalComp() {
  const { state, handleLogout } = useTotalComp()

  if (state.status === 'loading') {
    return (
      <PageShell>
        <div className={styles.statusPage}>Loading your compensation…</div>
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
        <section aria-label="Total compensation">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.compensation.title}</h2>
          <DraggableTileGrid
            items={data.comp}
            className={`${styles.tileGrid} ${styles.cols4}`}
            renderItem={(tile) => <BenefitTile tile={toCompTileView(tile)} />}
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

        <section aria-label="Compensation breakdown">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.breakdown.title}</h2>
          <div className={`${styles.tileGrid} ${styles.cols2}`}>
            <CompBreakdownTile breakdown={toCompBreakdownView(data.breakdown)} />
            <StockScenariosTile data={toCompScenariosView(data.scenarios)} />
          </div>
        </section>
      </main>
    </PageShell>
  )
}
