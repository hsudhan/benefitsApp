// View: health & wellness tile. All interpretation (badge tone, thermometer
// width/color) is precomputed by the presenter; this component only renders.

import type { HealthTileView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function HealthTile({ tile }: { tile: HealthTileView }) {
  const badgeClassName = [
    styles.statusBadge,
    tile.badgeTone === 'good' ? styles.badgeGood : styles.badgeWarn,
  ].join(' ')
  const fillClassName = [
    styles.thermoFill,
    styles[tile.fillClassKey],
    styles[tile.toneClassKey],
  ].join(' ')

  return (
    <div className={styles.tile}>
      <div className={styles.tileHead}>
        <span className={badgeClassName}>{tile.status}</span>
      </div>
      <p className={styles.tileTitle}>{tile.title}</p>
      <p className={styles.tileDesc}>{tile.description}</p>
      <p className={styles.tileStat}>{tile.statLine}</p>
      <div
        className={styles.thermo}
        role="progressbar"
        aria-valuenow={tile.utilization}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${tile.title} utilization`}
      >
        <div className={fillClassName} />
      </div>
    </div>
  )
}
