import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ActionMenu } from '@components'
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
    DotStackTarget: {
      display: 'flex',

      '& svg': {
        minWidth: '34px',
      },
    },
    DotStackTarget_Text: {
      textAlign: 'left',
      whiteSpace: 'pre-wrap',

      [md_viewer]: {
        whiteSpace: 'none',
      },
    },
  }
})

const noop = () => null

const DotStackTarget = ({ onClick = noop, color = '#000000' }) => {
  const c = useStyles({})
  return (
    <div className={c.DotStackTarget} onClick={onClick}>
      <DotStackIcon color={color} />
    </div>
  )
}

const DotStackActionMenu = ({
  onChange = noop,
  options = [],
  actionMenuTitle,
  color,
}) => {
  const c = useStyles({})

  const menuProps = useMemo(() => {
    return {
      className: c.DotStackActionMenu,
      onChange,
      actionBarTitle: actionMenuTitle,
      options,
      tabletLayout: false,
      alignItems: 'center',
    }
  }, [c.DotStackActionMenu, onChange, options, actionMenuTitle])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={targetProps => <DotStackTarget color={color} {...targetProps} />}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default DotStackActionMenu
