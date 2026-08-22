// View: dashboard equity report tile. Big bold report type, feed type row,
// and a white sub-tile carrying the equity value, share count, and a
// grant-by-grant vesting table.

import { Fragment } from 'react'
import type { EquityReportDTO } from '@/lib/types'
import styles from './Tiles.module.css'

export default function EquityReportTile({ report }: { report: EquityReportDTO }) {
  return (
    <div className={styles.tile}>
      <p className={styles.reportTitle}>{report.reportType}</p>
      <p className={styles.reportFeed}>{report.feedType}</p>
      <div className={styles.whiteTile}>
        <p className={styles.equityLabel}>{report.equityValueType}</p>
        {report.equityValue ? <p className={styles.equityValue}>{report.equityValue}</p> : null}
        <p className={styles.equityShareRow}>
          {report.equityShareCount ? <span>{report.equityShareCount} </span> : null}
          {report.shareAccountType ? <span>{report.shareAccountType}</span> : null}
        </p>
        <div className={styles.divider} />
        <table className={styles.grantTable}>
          <tbody>
            {report.grants.map((grant) => (
              <Fragment key={grant.id}>
                <tr>
                  <td className={styles.grantFigure}>{grant.sharesText}</td>
                  <td className={`${styles.grantFigure} ${styles.grantFigureRight}`}>{grant.valueText}</td>
                </tr>
                <tr>
                  <td className={styles.grantDescription}>{grant.description}</td>
                  <td className={styles.grantStatusCell}>
                    <span
                      className={`${styles.grantStatus} ${
                        grant.status === 'VESTED' ? styles.statusVested : styles.statusUnvested
                      }`}
                    >
                      {grant.status}
                    </span>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {report.stockType || report.lastUpdated ? (
          <p className={styles.equityFooterRow}>
            {report.stockType ? <span>{report.stockType} </span> : null}
            {report.lastUpdated ? <span>{report.lastUpdated}</span> : null}
          </p>
        ) : null}
      </div>
    </div>
  )
}
