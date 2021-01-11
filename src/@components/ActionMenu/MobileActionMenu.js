import React, { useRef } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useActionMenu, useExternalClick } from '@hooks'
import ActionMenuPortal from './ActionMenuPortal'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    MobileActionMenu: {
      width: '100%',
      backgroundColor: theme.colors.white[300],
      overflow: 'auto',
      opacity: 0,
      position: 'fixed',
      zIndex: 3,
      bottom: '-200px',
      borderRadius: '1rem 1rem 0 0',
      transition: 'all .4s',
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
    MobileActionMenu_ActionMenu: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  }
})

export const MobileActionMenu = ({ className, ...props }) => {
  const actionBarRef = useRef(null)
  const { setActionMenuClose } = useActionMenu()
  useExternalClick(actionBarRef, setActionMenuClose)
  const c = useStyles({})

  return (
    <ActionMenuPortal className={classnames(className, c.MobileActionMenu)} {...props} />
  )
}
