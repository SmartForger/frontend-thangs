import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { DropdownMenu } from '@components'
import { createUseStyles } from '@style'
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
  }
})

const ActionMenu = ({
  TargetComponent,
  TargetComponentProps,
  MenuComponent,
  MenuComponentProps,
  isOpenByDefault = false,
  showMobileActionBar = true,
}) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const { onChange: handleOnChange, ...menuProps } = MenuComponentProps

  const onChange = useCallback(
    value => {
      handleOnChange(value)
      dispatch(types.CLOSE_ACTION_BAR)
    },
    [dispatch, handleOnChange]
  )

  const onTargetClick = useCallback(() => {
    if (showMobileActionBar)
      dispatch(types.OPEN_ACTION_BAR, {
        Component: MenuComponent,
        data: {
          onChange,
          ...menuProps,
        },
      })
  }, [MenuComponent, dispatch, menuProps, onChange, showMobileActionBar])

  return (
    <DropdownMenu
      className={c.ActionMenu}
      TargetComponent={TargetComponent}
      TargetComponentProps={TargetComponentProps}
      isOpenByDefault={isOpenByDefault}
      onTargetClick={onTargetClick}
    >
      <MenuComponent onChange={onChange} {...menuProps} />
    </DropdownMenu>
  )
}

export default ActionMenu
