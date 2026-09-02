// View: dashboard top questions tile. Big bold questionsMessage header, a
// muted subtextType row, then a white tile of peer-question rows separated by
// horizontal lines — each row pairs a question-bubble icon with black bold
// question text and a gray oval "Ask AI" button (blue foreground).

import type { TopQuestionsDTO } from '@/lib/types'
import styles from './Tiles.module.css'

export default function TopQuestionsTile({ panel }: { panel: TopQuestionsDTO }) {
  return (
    <div className={styles.tile}>
      <p className={styles.reportTitle}>{panel.questionsMessage}</p>
      <p className={styles.reportFeed}>{panel.subtextType}</p>
      <div className={styles.whiteTile}>
        {panel.questions.map((question) => (
          <div key={question.id} className={styles.questionRow}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/question-bubble.svg" alt="" className={styles.questionIcon} />
            <p className={styles.questionText}>{question.questionText}</p>
            <a href={question.actionHref} className={styles.actionBtn}>
              {question.actionLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
