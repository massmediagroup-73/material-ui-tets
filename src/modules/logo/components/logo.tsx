import React, { ReactElement } from 'react'
import classnames from 'classnames'
import logo from 'images/mrionline-logo-blue-dark-320.png'
import styles from './logo.module.scss'

interface Props {
  isHrCentered?: boolean
}

export const Logo: React.FC<Props> = ({ isHrCentered }): ReactElement => {
  return (
    <div className={classnames(styles.logo, { [styles.logo_hrCenter]: isHrCentered })}>
      <img src={logo} alt="Mri online" />
    </div>
  )
}
