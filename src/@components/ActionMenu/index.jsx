// ActionMenu - Component used with DropdownMenu

import React, { useCallback } from 'react'
import { DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import classnames from 'classnames'
import { useActionMenu } from '@hooks'

export * from './ActionMenuContext'
export * from './ActionMenuPortal'
export * from './MobileActionMenu'
export * from './menus'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    ActionMenu: {
      opacity: ({ isMobileActive }) => (isMobileActive ? '0 !important' : 1),
      visibility: ({ isMobileActive }) =>
        isMobileActive ? 'hidden !important' : 'visible',
      width: 'auto !important',

      [md]: {
        opacity: 1,
        visibility: 'visible',
      },
    },
    DefaultMenu_Item: {
      flexDirection: 'column',
      justifyContent: 'left',

      [md_viewer]: {
        flexDirection: 'row',
      },
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
    DefaultMenu__desktopTablet: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    DefaultMenu__tablet: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
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
    DefaultMenu_WrapperTablet: {
      [md_viewer]: {
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
    DefaultMenu_TabletRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',

      [md_viewer]: {
        display: 'block',
        width: 'unset',
      },
    },
    ActionMenu__hidden: {
      display: 'none !important',

      [md_viewer]: {
        display: 'flex !important',
      },
    },
  }
})

const noop = () => null

const DefaultMenu = ({ onChange = noop, options = [], tabletLayout }) => {
  const c = useStyles({ tabletLayout })

  return (
    <div
      className={classnames({
        [c.DefaultMenu_Wrapper]: !tabletLayout,
        [c.DefaultMenu_WrapperTablet]: tabletLayout,
      })}
    >
      {options.map((option, ind) => {
        const { Icon = null } = option
        return (
          <React.Fragment key={`${option.value}_${ind}`}>
            <DropdownItem
              onClick={() => onChange(option.value)}
              className={c.DefaultMenu_Item}
            >
              <Spacer
                size={'.5rem'}
                className={classnames({
                  [c.DefaultMenu__mobile]: !tabletLayout,
                  [c.DefaultMenu__desktopTablet]: tabletLayout,
                })}
              />
              <div
                className={classnames({
                  [c.DefaultMenu_MobileRow]: !tabletLayout,
                  [c.DefaultMenu_TabletRow]: tabletLayout,
                })}
              >
                <Spacer
                  className={classnames({
                    [c.DefaultMenu__desktop]: !tabletLayout,
                    [c.DefaultMenu__desktopTablet]: tabletLayout,
                  })}
                  size={'.5rem'}
                />
                <div className={c.DefaultMenu_Row}>
                  {Icon && (
                    <>
                      <Icon />
                      <Spacer size={'.75rem'} />
                    </>
                  )}
                  <LabelText>{option.label}</LabelText>
                </div>
                <ArrowRightIcon className={c.DefaultMenu__tablet} />
                <Spacer
                  className={classnames({
                    [c.DefaultMenu__desktop]: !tabletLayout,
                    [c.DefaultMenu__desktopTablet]: tabletLayout,
                  })}
                  size={'.5rem'}
                />
              </div>
              <Spacer size={'.5rem'} />
            </DropdownItem>
            <Spacer
              className={classnames({
                [c.DefaultMenu__mobile]: !tabletLayout,
                [c.DefaultMenu__tablet]: tabletLayout,
              })}
              size={'.5rem'}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export const ActionMenu = props => {
  const {
    TargetComponent,
    TargetComponentProps,
    MenuComponent = DefaultMenu,
    MenuComponentProps,
    isAutoClosed = true,
    isExternalClosed = false,
    isMobileActionBarActive = true,
    isOpenByDefault = false,
  } = props
  const c = useStyles({})
  const { onChange, className, ...menuProps } = MenuComponentProps
  const { setActionMenu, setActionMenuClose } = useActionMenu()
  const handleChange = useCallback(
    value => {
      onChange(value)
      setActionMenuClose()
    },
    [onChange, setActionMenuClose]
  )

  const handleTargetClick = useCallback(() => {
    if (isMobileActionBarActive)
      setActionMenu({
        isOpen: true,
        Component: MenuComponent,
        data: {
          onChange: handleChange,
          ...menuProps,
        },
      })
  }, [MenuComponent, handleChange, isMobileActionBarActive, menuProps, setActionMenu])

  return (
    <DropdownMenu
      className={classnames(className, c.ActionMenu, {
        [c.ActionMenu__hidden]: isMobileActionBarActive,
      })}
      TargetComponent={TargetComponent}
      TargetComponentProps={TargetComponentProps}
      isAutoClosed={isAutoClosed}
      isExternalClosed={isExternalClosed}
      isOpenByDefault={isOpenByDefault}
      onTargetClick={handleTargetClick}
    >
      <MenuComponent
        onChange={handleChange}
        isMobileActionBarActive={isMobileActionBarActive}
        {...menuProps}
      />
    </DropdownMenu>
  )
}