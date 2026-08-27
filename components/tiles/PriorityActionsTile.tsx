// View: dashboard priority actions tile. Big bold actionsTitle header over a
// white panel of three action tiles — each with a gray category title, big
// black bold action title, description, and a gray oval button with blue
// foreground.

import type { PriorityActionsDTO } from '@/lib/types'
import styles from './Tiles.module.css'

export default function PriorityActionsTile({ panel }: { panel: PriorityActionsDTO }) {
  return (
    <div className={styles.tile}>
      <p className={styles.reportTitle}>{panel.actionsTitle}</p>
      <div className={styles.actionsPanel}>
        {panel.actions.map((action) => (
          <div key={action.id} className={styles.actionTile}>
            <p className={styles.actionCategory}>{action.actionCategory}</p>
            <p className={styles.actionTitle}>{action.actionTitle}</p>
            <p className={styles.actionDescription}>{action.actionDescription}</p>
            <a href={action.actionHref} className={styles.actionBtn}>
              {action.actionLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
