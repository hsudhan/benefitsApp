// View: portfolio quick-action tile: black bar image, a tiny icon, and the
// center-aligned label below. No card chrome — the bar sits directly on the
// page background so the row of bars packs flush.

import type { PortfolioTileView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function PortfolioTile({ tile }: { tile: PortfolioTileView }) {
  return (
    <div className={styles.qaTile}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/black-bar.svg" alt="" className={styles.blackBar} />
      {tile.iconSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tile.iconSrc} alt="" className={styles.qaIcon} />
      ) : null}
      <p className={`${styles.tileTitle} ${styles.qaLabel}`}>{tile.title}</p>
    </div>
  )
}
