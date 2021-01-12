import React, { useRef } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useActionMenu, useExternalClick } from '@hooks'
import { ActionMenuPortal } from './ActionMenuPortal'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
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
    },
    MobileActionMenu_ActionMenu: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    MobileActionMenu__mobileOnly: {
      [md]: {
        display: 'none',
      },
    },
    MobileActionMenu__tablet: {
      [md_viewer]: {
        display: 'none !important',
      },
    },
  }
})

export const MobileActionMenu = ({ className, tabletLayout, ...props }) => {
  const actionMenuRef = useRef(null)
  const { setActionMenuClose, isActionMenuOpen } = useActionMenu()
  useExternalClick(actionMenuRef, () => {
    if (isActionMenuOpen) setActionMenuClose()
  })
  const c = useStyles({})

  return (
    <ActionMenuPortal
      className={classnames(className, c.MobileActionMenu, {
        [c.MobileActionMenu__mobileOnly]: !tabletLayout,
        [c.MobileActionMenu__tablet]: tabletLayout,
      })}
      actionMenuRef={actionMenuRef}
      mobileOnly={!tabletLayout}
      {...props}
    />
  )
}
