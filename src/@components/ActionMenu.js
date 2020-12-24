// ActionMenu - Component used with DropdownMenu

import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    ActionMenu: {
      bottom: '4.75rem',
      right: '-1.125rem !important',
      opacity: 0,
      visibility: 'hidden',
      width: 'auto !important',

      [md]: {
        opacity: 1,
        visibility: 'visible',
      },
    },
    DefaultMenu_Item: {
      justifyContent: 'space-between',
    },
    DefaultMenu_Row: {
      ...theme.mixins.flexRow,
      alignItems: 'center',
    },
    DefaultMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    DefaultMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const DefaultMenu = ({ onChange = noop, options = [] }) => {
  const c = useStyles({})

  return (
    <div>
      {options.map((option, ind) => {
        const { Icon = noop } = option
        return (
          <React.Fragment key={`drawmodes_${ind}`}>
            <DropdownItem
              onClick={() => onChange(option.value)}
              className={c.DefaultMenu_Item}
            >
              <div className={c.DefaultMenu_Row}>
                <Icon />
                <Spacer size={'.75rem'} />
                <LabelText>{option.label}</LabelText>
              </div>
              <ArrowRightIcon className={c.DefaultMenu__mobile} />
            </DropdownItem>
            <Spacer className={c.DefaultMenu__desktop} size={'.25rem'} />
            <Spacer className={c.DefaultMenu__mobile} size={'2rem'} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

const ActionMenu = ({
  TargetComponent,
  TargetComponentProps,
  MenuComponent = DefaultMenu,
  MenuComponentProps,
  isOpenByDefault = false,
  isMobileActionBarActive = true,
}) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const { onChange, ...menuProps } = MenuComponentProps

  const handleChange = useCallback(
    value => {
      onChange(value)
      dispatch(types.CLOSE_ACTION_BAR)
    },
    [dispatch, onChange]
  )

  const handleTargetClick = useCallback(() => {
    if (isMobileActionBarActive)
      dispatch(types.OPEN_ACTION_BAR, {
        Component: MenuComponent,
        data: {
          onChange: handleChange,
          ...menuProps,
        },
      })
  }, [isMobileActionBarActive, dispatch, MenuComponent, handleChange, menuProps])

  return (
    <DropdownMenu
      className={c.ActionMenu}
      TargetComponent={TargetComponent}
      TargetComponentProps={TargetComponentProps}
      isOpenByDefault={isOpenByDefault}
      onTargetClick={handleTargetClick}
    >
      <MenuComponent onChange={handleChange} {...menuProps} />
    </DropdownMenu>
  )
}

export default ActionMenu
