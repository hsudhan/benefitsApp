'use client'

// View: Dashboard page. All data arrives over the REST API via the
// useDashboard hook; DTOs are mapped to view-models by presenters. This
// component contains no data access and no business logic. Sections render
// inline: Priority Items, Net Worth, Quick Actions, then the equity report
// tiles. The page
// renders inside the shared PageShell: a 70%-width center panel flanked by
// 15%-width gray side panels.

import AppHeader from '@/components/AppHeader'
import PageShell from '@/components/PageShell'
import DraggableTileGrid from '@/components/DraggableTileGrid'
import NetWorthTile from '@/components/tiles/NetWorthTile'
import PortfolioTile from '@/components/tiles/PortfolioTile'
import PriorityActionsTile from '@/components/tiles/PriorityActionsTile'
import TopQuestionsTile from '@/components/tiles/TopQuestionsTile'
import EquityReportTile from '@/components/tiles/EquityReportTile'
import BalanceSheetTile from '@/components/tiles/BalanceSheetTile'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { toBalanceSheetView, toNetWorthTileView, toPortfolioTileView } from '@/lib/presenters'
import styles from './AppPage.module.css'

const SECTION_COPY = {
  networth: { title: 'Net Worth' },
  quickActions: { title: 'Quick Actions' },
} as const

export default function Dashboard() {
  const { state, handleLogout } = useDashboard()

  if (state.status === 'loading') {
    return (
      <PageShell>
        <div className={styles.statusPage}>Loading…</div>
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
       

        <section aria-label="Net worth">
          <h2 className={styles.sectionTitle}>{SECTION_COPY.networth.title}</h2>
          <DraggableTileGrid
            items={data.networth}
            className={`${styles.tileGrid} ${styles.cols4}`}
            renderItem={(tile) => <NetWorthTile tile={toNetWorthTileView(tile)} />}
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

        <section aria-label="Equity report">
          <div className={`${styles.tileGrid} ${styles.cols2}`}>
            <EquityReportTile report={data.equityReport} />
            <BalanceSheetTile report={toBalanceSheetView(data.balanceSheet)} />
          </div>
        </section>

         <section aria-label="Priority items">
          <PriorityActionsTile panel={data.priorityActions} />
        </section>

        <section aria-label="Top questions">
          <TopQuestionsTile panel={data.topQuestions} />
        </section>
      </main>
    </PageShell>
  )
}
