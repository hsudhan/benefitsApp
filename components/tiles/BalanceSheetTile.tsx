// View: dashboard balance sheet tile. Big bold report type, feed type row,
// a white sub-tile whose top row pairs a circular stock-percent thermometer
// (gray track, teal arc, max 100%) with the stock type and its big bold
// percent, and a second white sub-tile with the holdings table (bold values,
// maroon for liabilities) closed by a bold total row. All
// formatting/interpretation is precomputed by the presenter; this component
// only renders.

import type { BalanceSheetView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function BalanceSheetTile({ report }: { report: BalanceSheetView }) {
  const gaugeClassName = [styles.gaugeFill, styles[report.gaugeFillClassKey]].join(' ')

  return (
    <div className={styles.tile}>
      <p className={styles.reportTitle}>{report.reportType}</p>
      <p className={styles.reportFeed}>{report.feedType}</p>
      <div className={styles.whiteTile}>
        <div className={styles.stockGaugeRow}>
          <svg
            className={styles.gauge}
            viewBox="0 0 36 36"
            role="progressbar"
            aria-valuenow={report.stockPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${report.stockType} ${report.stockPercentText}`}
          >
            <circle className={styles.gaugeTrack} cx="18" cy="18" r="16" pathLength={100} />
            <circle className={gaugeClassName} cx="18" cy="18" r="16" pathLength={100} />
          </svg>
          <div>
            <p className={styles.stockType}>{report.stockType}</p>
            <p className={styles.stockPercent}>{report.stockPercentText}</p>
          </div>
        </div>
      </div>
      <div className={`${styles.whiteTile} ${styles.whiteTileBelow}`}>
        <table className={styles.holdingsTable}>
          <tbody>
            {report.holdings.map((holding) => (
              <tr key={holding.id}>
                <td className={styles.holdingType}>{holding.investmentType}</td>
                <td
                  className={`${styles.holdingValue} ${
                    holding.valueTone === 'maroon' ? styles.valueMaroon : ''
                  }`}
                >
                  {holding.investmentValue}
                </td>
              </tr>
            ))}
            <tr>
              <td className={`${styles.holdingType} ${styles.holdingTypeBold}`}>
                {report.totalType}
              </td>
              <td className={styles.holdingValue}>{report.totalValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
