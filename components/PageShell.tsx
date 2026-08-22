// View: shared page shell for the tabbed pages (Dashboard, Total Comp,
// Portfolio & Banking, Benefits). Renders the page as a center panel that
// takes 70% of the screen width, flanked by gray panels that each take
// 15% of the screen width on the left and right.

import type { ReactNode } from 'react'
import styles from './PageShell.module.css'

interface PageShellProps {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidePanel} aria-hidden="true" />
      <div className={styles.centerPanel}>{children}</div>
      <aside className={styles.sidePanel} aria-hidden="true" />
    </div>
  )
}
