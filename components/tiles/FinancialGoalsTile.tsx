// View: Total Comp financial goals tile. Gray tile carrying the big bold
// financialGoalsTileTitle header with a white oval "Add Milestone" button
// (blue foreground) to its right; the white table below lists the goal rows —
// each three stacked lines: black bold sharesType, gray shareDescription,
// gray goalDate.

import type { FinancialGoalsDTO } from '@/lib/types'
import styles from './Tiles.module.css'

export default function FinancialGoalsTile({ panel }: { panel: FinancialGoalsDTO }) {
  return (
    <>
      <div className={styles.goalsTile}>
        <div className={styles.goalsHeader}>
          <p className={styles.reportTitle}>{panel.financialGoalsTileTitle}</p>
          <a href={panel.actionHref} className={styles.milestoneBtn}>
            {panel.actionLabel}
          </a>
        </div>
      </div>
      <div className={`${styles.whiteTile} ${styles.whiteTileBelow}`}>
        {panel.goals.map((goal) => (
          <div key={goal.id} className={styles.goalRow}>
            <p className={styles.goalTitle}>{goal.sharesType}</p>
            <p className={styles.goalDescription}>{goal.shareDescription}</p>
            <p className={styles.goalDate}>{goal.goalDate}</p>
          </div>
        ))}
      </div>
    </>
  )
}
