import React from 'react'
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    VersionPicture: {
      display: 'flex',
      backgroundColor: theme.colors.blue[500],
      width: 48,
      height: 48,
      borderRadius: '100%',
      marginRight: 16,
    },
    VersionPicture_Icon: {
      display: 'block',
      margin: 'auto',
      fill: `${theme.color.white[900]} !important`,
    },
  }
})

export function VersionPicture() {
  const c = useStyles()
  return (
    <div className={c.VersionPicture_Icon}>
      <VersionIcon className={c.VersionPicture_Icon} />
    </div>
  )
}
