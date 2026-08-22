'use client'

// View: Portfolio & Banking tab. The spec leaves this tab blank — only the
// header with the top-level tab navigation is rendered. The page renders
// inside the shared PageShell: a 70%-width center panel flanked by
// 15%-width gray side panels.

import AppHeader from '@/components/AppHeader'
import PageShell from '@/components/PageShell'
import { useUser } from '@/lib/hooks/useUser'
import styles from './AppPage.module.css'

export default function Portfolio() {
  const { state, handleLogout } = useUser()

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

  return (
    <PageShell>
      <AppHeader displayName={state.data.user.displayName} onLogout={handleLogout} />
      <main className={styles.pageMain} aria-label="Portfolio and Banking" />
    </PageShell>
  )
}
