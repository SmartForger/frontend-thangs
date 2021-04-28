import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ActionMenu, IconButton } from '@components'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    DotStackActionMenu: {
      top: '1rem',
      left: '.5rem',
      right: 'unset !important',
    },
    DotStackActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    DotStackActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    DotStackActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const DotStackTarget = ({ onClick = noop, color = '#000000', isStaticBackground }) => {
  return (
    <IconButton isHoverable={!isStaticBackground} onClick={onClick}>
      <DotStackIcon color={color} />
    </IconButton>
  )
}

const DotStackActionMenu = ({
  actionMenuTitle,
  alignItems = 'center',
  color,
  isStaticBackground,
  menuComponentProps,
  onChange = noop,
  options = [],
}) => {
  const c = useStyles({})

  const menuProps = useMemo(() => {
    return {
      className: c.DotStackActionMenu,
      onChange,
      actionBarTitle: actionMenuTitle,
      options,
      tabletLayout: false,
      alignItems,
      ...menuComponentProps,
    }
  }, [
    c.DotStackActionMenu,
    onChange,
    options,
    actionMenuTitle,
    alignItems,
    menuComponentProps,
  ])

  const targetComponentProps = useMemo(() => ({ isStaticBackground, color }), [
    isStaticBackground,
    color,
  ])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={DotStackTarget}
      TargetComponentProps={targetComponentProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default DotStackActionMenu
