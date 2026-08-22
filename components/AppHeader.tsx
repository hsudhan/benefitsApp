'use client'

// View: application header with the top-level tab navigation. The active tab
// is derived from the current pathname — no navigation state is stored here.
// Keyboard shortcuts: Ctrl/Cmd+Down moves to the next tab, Ctrl/Cmd+Up moves
// to the previous tab (Windows Ctrl, macOS Cmd); both wrap around the ends.

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './AppHeader.module.css'

const TABS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Total Comp', href: '/total-comp' },
  { label: 'Portfolio & Banking', href: '/portfolio' },
  { label: 'Benefits', href: '/benefits' },
] as const

interface AppHeaderProps {
  displayName: string
  onLogout: () => void
}

export default function AppHeader({ displayName, onLogout }: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.ctrlKey && !event.metaKey) return
      const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
      if (step === 0) return
      event.preventDefault()
      const index = TABS.findIndex((tab) => tab.href === pathname)
      const next = TABS[(index + step + TABS.length) % TABS.length]
      if (next.href !== pathname) {
        router.push(next.href)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pathname, router])

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerInner}>
        <div className={styles.headerBrand}>
          <div className={styles.brandMarkLight}>B</div>
          <span>Workplace Intelligence</span>
        </div>
        <nav className={styles.tabNav} aria-label="Primary">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
        <div className={styles.headerUser}>
          <span className={styles.welcome}>Welcome, {displayName}</span>
          <button type="button" className={styles.logoutBtn} onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </header>
  )
}
