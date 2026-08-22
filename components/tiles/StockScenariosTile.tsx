// View: PLTR stock scenario tile. Tile a: three mini tiles (bear/current/
// bull), each with stock type, stock value, and total value rows. Tile b: a
// big bold "Note" label followed by the disclosure text.

import type { CompScenariosView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function StockScenariosTile({ data }: { data: CompScenariosView }) {
  return (
    <div className={styles.tile}>
      <div className={styles.miniGrid}>
        {data.scenarios.map((scenario) => (
          <div key={scenario.id} className={styles.miniTile}>
            <p className={styles.miniType}>{scenario.stockType}</p>
            <p className={styles.miniValue}>{scenario.stockValueText}</p>
            <p className={styles.miniTotal}>{scenario.totalValueText}</p>
          </div>
        ))}
      </div>
      <p className={styles.noteTitle}>Note</p>
      <p className={styles.noteText}>{data.disclosureText}</p>
    </div>
  )
}
