// View: dashboard net-worth tile. Renders a prepared view-model — no data
// access, no business logic. Shows either a description row (plain or green)
// or a gray oval hyperlink button under the amount.

import type { NetWorthTileView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function NetWorthTile({ tile }: { tile: NetWorthTileView }) {
  return (
    <div className={styles.tile}>
      <p className={styles.tileTitle}>{tile.title}</p>
      <p className={styles.tileAmount}>{tile.valueText}</p>
      {tile.actionLabel ? (
        <a href={tile.actionHref ?? '#'} className={styles.claimBtn}>
          {tile.actionLabel}
        </a>
      ) : (
        <p className={tile.descriptionTone === 'green' ? styles.descGreen : styles.tileSub}>
          {tile.description ?? ''}
        </p>
      )}
    </div>
  )
}
