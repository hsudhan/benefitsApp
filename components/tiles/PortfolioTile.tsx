// View: portfolio quick-action tile: black bar image, a tiny icon, and the
// center-aligned label below.

import type { PortfolioTileView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function PortfolioTile({ tile }: { tile: PortfolioTileView }) {
  return (
    <div className={styles.tile}>
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
