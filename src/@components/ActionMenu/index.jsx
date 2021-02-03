// ActionMenu - Component used with DropdownMenu

import React, { useCallback } from 'react'
import { DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import classnames from 'classnames'
import { useActionMenu, useIsMobile } from '@hooks'

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
      bottom: ({ showTop }) => (showTop ? '5rem' : undefined),
      opacity: ({ isMobileActive }) => (isMobileActive ? '0 !important' : '1'),
      visibility: ({ isMobileActive }) =>
        isMobileActive ? 'hidden !important' : 'visible',
      width: 'auto !important',

      [md]: {
        opacity: '1',
        visibility: 'visible',
      },

      '& button': {
        outline: 'none',
      },
    },
    DefaultMenu_Item: {
      flexDirection: 'column',
      justifyContent: 'left',

      [md_viewer]: {
        flexDirection: 'row',
      },

      '& > button': {
        width: '100%',
      },
    },
    DefaultMenu_Item__mobileOnly: {
      flexDirection: 'column',
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
        justifyContent: 'left',
      },
    },
    DefaultMenu_TabletRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      padding: '.5rem',

      [md_viewer]: {
        display: 'block',
        width: 'unset',
        padding: '0',
      },
    },
    ActionMenu__hidden__mobileOnly: {
      display: 'none !important',

      [md]: {
        display: 'flex !important',
      },
    },
    ActionMenu__hidden__mobileTablet: {
      display: 'none !important',

      [md_viewer]: {
        display: 'flex !important',
      },
    },
  }
})

const noop = () => null

const wrapIfComponent = ({ Component, children, props }) => {
  if (Component) {
    return <Component {...props}>{children}</Component>
  } else {
    return children
  }
}

const DefaultMenu = ({ onChange = noop, options = [], tabletLayout, isMobileOnly }) => {
  const c = useStyles({ tabletLayout })

  return (
    <div
      className={classnames({
        [c.DefaultMenu_Wrapper]: !tabletLayout,
        [c.DefaultMenu_WrapperTablet]: tabletLayout,
      })}
    >
      {options.map((option, ind) => {
        const { Icon = null, Component = null, props = {} } = option
        return (
          <React.Fragment key={`${option.value}_${ind}`}>
            <DropdownItem
              onClick={
                option.onClick && typeof option.onClick === 'function'
                  ? option.onClick()
                  : () => onChange(option.value)
              }
              className={classnames({
                [c.DefaultMenu_Item]: !isMobileOnly,
                [c.DefaultMenu_Item__mobileOnly]: isMobileOnly,
              })}
            >
              {' '}
              {wrapIfComponent({
                Component,
                children: (
                  <>
                    <Spacer
                      size={'.5rem'}
                      className={classnames({
                        [c.DefaultMenu__mobile]: !tabletLayout,
                        [c.DefaultMenu__desktopTablet]: tabletLayout,
                      })}
                    />
                    {(!tabletLayout || isMobileOnly) && (
                      <Spacer size={'.5rem'} className={c.DefaultMenu__desktop} />
                    )}
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
                      <ArrowRightIcon
                        className={classnames({
                          [c.DefaultMenu__mobile]: isMobileOnly,
                          [c.DefaultMenu__tablet]: !isMobileOnly,
                        })}
                      />
                      <Spacer
                        className={classnames({
                          [c.DefaultMenu__desktop]: !tabletLayout,
                          [c.DefaultMenu__desktopTablet]: tabletLayout,
                        })}
                        size={'.5rem'}
                      />
                    </div>
                    <Spacer size={'.5rem'} />
                  </>
                ),
                props,
              })}
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
    isMobileOnly = false,
    showTop,
  } = props
  const c = useStyles({ showTop })
  const { onChange, className, ...menuProps } = MenuComponentProps
  const { setActionMenu, setActionMenuClose } = useActionMenu()
  const isMobile = useIsMobile()
  const handleChange = useCallback(
    value => {
      onChange(value)
      setActionMenuClose()
    },
    [onChange, setActionMenuClose]
  )

  const handleTargetClick = useCallback(() => {
    if (isMobileActionBarActive && isMobile)
      setActionMenu({
        isOpen: true,
        Component: MenuComponent,
        data: {
          onChange: handleChange,
          ...menuProps,
        },
      })
  }, [
    MenuComponent,
    handleChange,
    isMobile,
    isMobileActionBarActive,
    menuProps,
    setActionMenu,
  ])

  return (
    <DropdownMenu
      className={classnames(className, c.ActionMenu, {
        [c.ActionMenu__hidden__mobileOnly]: isMobileActionBarActive && isMobileOnly,
        [c.ActionMenu__hidden__mobileTablet]: isMobileActionBarActive && !isMobileOnly,
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
        isMobileOnly={isMobileOnly}
        {...menuProps}
      />
    </DropdownMenu>
  )
}
