// View: benefit tile. Renders a prepared view-model — no data access, no
// business logic, no inline styles.

import type { BenefitTileView } from '@/lib/presenters'
import styles from './Tiles.module.css'

function TrendIcon({ down }: { down: boolean }) {
  const className = down ? styles.trendIconDown : undefined
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

export default function BenefitTile({ tile }: { tile: BenefitTileView }) {
  const isTrend = tile.secondaryClassName !== 'plain'
  const subClassName = [
    styles.tileSub,
    isTrend ? styles.trend : '',
    tile.secondaryClassName === 'trendUp' ? styles.trendUp : '',
    tile.secondaryClassName === 'trendDown' ? styles.trendDown : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.tile}>
      <p className={styles.tileTitle}>{tile.title}</p>
      <p className={styles.tileAmount}>{tile.primaryValue}</p>
      <p className={subClassName}>
        {isTrend && <TrendIcon down={tile.secondaryClassName === 'trendDown'} />}
        {tile.secondaryText}
      </p>
    </div>
  )
}
