// ActionMenu - Component used with DropdownMenu

import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import * as types from '@constants/storeEventTypes'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    ActionMenu: {
      opacity: 0,
      visibility: 'hidden',
      width: 'auto !important',

      [md]: {
        opacity: 1,
        visibility: 'visible',
      },
    },
    DefaultMenu_Item: {
      justifyContent: 'left',
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
    DefaultMenu_Wrapper: {
      [md]: {
        margin: '-.5rem',
      },
    },
    DefaultMenu_MobileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',

      [md]: {
        display: 'block',
        width: 'unset',
      },
    },
  }
})

const noop = () => null

const DefaultMenu = ({ onChange = noop, options = [] }) => {
  const c = useStyles({})

  return (
    <div className={c.DefaultMenu_Wrapper}>
      {options.map((option, ind) => {
        const { Icon = null } = option
        return (
          <React.Fragment key={`${option.value}_${ind}`}>
            <DropdownItem
              onClick={() => onChange(option.value)}
              className={c.DefaultMenu_Item}
            >
              <Spacer className={c.DefaultMenu__desktop} size={'.5rem'} />
              <div className={c.DefaultMenu_MobileRow}>
                <Spacer className={c.DefaultMenu__desktop} size={'.5rem'} />
                <div className={c.DefaultMenu_Row}>
                  {Icon && (
                    <>
                      <Icon />
                      <Spacer size={'.75rem'} />
                    </>
                  )}
                  <LabelText>{option.label}</LabelText>
                </div>
                <ArrowRightIcon className={c.DefaultMenu__mobile} />
                <Spacer className={c.DefaultMenu__desktop} size={'.5rem'} />
              </div>
              <Spacer className={c.DefaultMenu__desktop} size={'.5rem'} />
            </DropdownItem>
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
  isAutoClosed = true,
  isExternalClosed = false,
  isMobileActionBarActive = true,
  isOpenByDefault = false,
}) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const { onChange, className, ...menuProps } = MenuComponentProps

  const handleChange = useCallback(
    value => {
      onChange(value)
      dispatch(types.CLOSE_ACTION_BAR)
    },
    [dispatch, onChange]
  )

  const handleTargetClick = useCallback(() => {
    // This is currently causing some major performance issues
    // with the viewer tool dropdowns i.e part explorer - BE
    //
    // if (isMobileActionBarActive)
    // dispatch(types.OPEN_ACTION_BAR, {
    //   Component: MenuComponent,
    //   data: {
    //     onChange: handleChange,
    //     ...menuProps,
    //   },
    // })
  }, [])

  return (
    <DropdownMenu
      className={classnames(className, c.ActionMenu)}
      TargetComponent={TargetComponent}
      TargetComponentProps={TargetComponentProps}
      isAutoClosed={isAutoClosed}
      isExternalClosed={isExternalClosed}
      isOpenByDefault={isOpenByDefault}
      onTargetClick={handleTargetClick}
    >
      <MenuComponent onChange={handleChange} {...menuProps} />
    </DropdownMenu>
  )
}

export default ActionMenu
