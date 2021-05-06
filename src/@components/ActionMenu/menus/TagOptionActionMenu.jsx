import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ActionMenu, Tag, Spacer } from '@components'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    TagOptionActionMenu: {
      top: '1rem',
      left: '.5rem',
      right: 'unset !important',
      justifyContent: 'flex-start',
    },
    TagOptionActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    TagOptionActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    TagOptionActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
    TagOption_DropdownIcon: {
      '& > path': {
        fill: theme.colors.white[600],
        stroke: theme.colors.white[600],
      },
    },
  }
})

const noop = () => null

const TagOptionTarget = ({ onClick = noop, color = '#999999', selectedValue }) => {
  const c = useStyles({})
  return (
    <Tag onClick={onClick} color={color} lightText>
      {selectedValue}
      <Spacer size='.25rem' />
      <ArrowDownIcon className={c.TagOption_DropdownIcon} />
    </Tag>
  )
}

const TagOptionActionMenu = ({
  actionMenuTitle,
  alignItems = 'left',
  color,
  isStaticBackground,
  menuComponentProps,
  onChange = noop,
  options = [],
  selectedValue,
  targetClass,
}) => {
  const c = useStyles({})

  const menuProps = useMemo(() => {
    return {
      className: c.TagOptionActionMenu,
      containerClassName: targetClass,
      onChange,
      actionBarTitle: actionMenuTitle,
      options,
      tabletLayout: false,
      alignItems,
      ...menuComponentProps,
    }
  }, [
    c.TagOptionActionMenu,
    targetClass,
    onChange,
    actionMenuTitle,
    options,
    alignItems,
    menuComponentProps,
  ])

  const targetComponentProps = useMemo(
    () => ({ isStaticBackground, color, selectedValue }),
    [isStaticBackground, color, selectedValue]
  )

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={TagOptionTarget}
      TargetComponentProps={targetComponentProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default TagOptionActionMenu
