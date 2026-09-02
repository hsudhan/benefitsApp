// View: retirement & equity tile. Standard variants render through the shared
// BenefitTile; the 'detail' variant renders the 401K contribution card
// (contribution tiles, IRS-limit thermometer, info tip); the 'unvested'
// variant renders the PLTR RSU card (unvested summary panels between gray
// dividers, then the borderless vesting-events table). All interpretation is
// precomputed by the presenter; this component only renders.

import BenefitTile from '@/components/tiles/BenefitTile'
import type { RetirementTileView } from '@/lib/presenters'
import styles from './Tiles.module.css'

export default function RetirementTile({ tile }: { tile: RetirementTileView }) {
  if (tile.layout === 'standard') {
    return <BenefitTile tile={tile.standard} />
  }

  if (tile.layout === 'unvested') {
    return (
      <div className={styles.tile}>
        <p className={styles.tileTitle}>{tile.title}</p>
        <div className={styles.divider} />
        <div className={styles.unvestedGrid}>
          <div>
            <p className={styles.tileTitle}>{tile.unvestedTotalType}</p>
            <p className={styles.tileAmount}>{tile.unvestedSharesText}</p>
            <p className={styles.tileSub}>{tile.unvestedSharesType}</p>
          </div>
          <div>
            <p className={styles.tileTitle}>{tile.unvestedValueType}</p>
            <p className={styles.tileAmount}>{tile.unvestedValueText}</p>
            <p className={styles.tileSub}>{tile.unvestedPriceType}</p>
          </div>
        </div>
        <div className={styles.divider} />
        <table className={styles.grantTable}>
          <tbody>
            {tile.vestingEvents.map((event) => (
              <tr key={event.id}>
                <td className={styles.vestingDate}>{event.vestingDate}</td>
                <td className={styles.grantFigure}>{event.sharesText}</td>
                <td className={styles.vestingValue}>{event.valueText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const fillClassName = [
    styles.thermoFill,
    styles[tile.fillClassKey],
    styles[tile.toneClassKey],
  ].join(' ')

  return (
    <div className={styles.tile}>
      <p className={styles.tileTitle}>{tile.title}</p>
      <div className={styles.divider} />
      <div className={styles.contributionGrid}>
        {tile.contributions.map((contribution, index) => (
          <div key={index}>
            <p className={styles.tileAmount}>{contribution.percentText}</p>
            <p className={styles.tileSub}>{contribution.amountText}</p>
          </div>
        ))}
      </div>
      <div
        className={styles.thermo}
        role="progressbar"
        aria-valuenow={tile.percentSpent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${tile.title} IRS limit progress`}
      >
        <div className={fillClassName} />
      </div>
      <p className={styles.progressText}>{tile.progressText}</p>
      <div className={styles.divider} />
      <div>
        <p className={styles.infoCategory}>{tile.infoCategory}</p>
        <p className={styles.infoType}>{tile.infoType}</p>
        <p className={styles.infoDescription}>{tile.infoDescription}</p>
      </div>
    </div>
  )
}
