// View: compensation breakdown tile. One row per compensation type (type
// left, bold amount + percent right), each followed by a teal thermometer;
// a white divider, then the bold total row.

import type { CompBreakdownView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function CompBreakdownTile({ breakdown }: { breakdown: CompBreakdownView }) {
  return (
    <div className={styles.tile}>
      {breakdown.rows.map((row) => (
        <div key={row.id} className={styles.breakBlock}>
          <div className={styles.breakRow}>
            <span className={styles.breakType}>{row.compType}</span>
            <span className={styles.breakFigures}>
              <span className={styles.breakAmount}>{row.amountText}</span>
              <span className={styles.breakPercent}>({row.percentText})</span>
            </span>
          </div>
          <div className={styles.thermo} role="img" aria-label={`${row.compType} ${row.percentText}`}>
            <div className={`${styles.thermoFill} ${styles.fillTeal} ${styles[row.fillClassKey]}`} />
          </div>
        </div>
      ))}
      <div className={styles.divider} />
      <div className={styles.totalRow}>
        <span>Total Compensation</span>
        <span>{breakdown.totalCompText}</span>
      </div>
    </div>
  )
}
