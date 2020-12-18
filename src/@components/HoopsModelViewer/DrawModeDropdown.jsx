import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { DropdownMenu, DropdownItem, Spacer, LabelText, TitleTertiary } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as WireModeSelected } from '@svg/view-mode-wire-selected.svg'
import { ReactComponent as ShadedModeSelected } from '@svg/view-mode-shaded-selected.svg'
import { ReactComponent as XRayModeSelected } from '@svg/view-mode-xray-selected.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    DrawModeDropdown: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    DrawModeDropdown_ActionMenu: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    DrawModeDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    DrawModeDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    DrawModeDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    DrawModeDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    DrawModeDropdown_Item: {
      justifyContent: 'space-between',
    },
    DrawModeDropdown__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    DrawModeDropdown__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const options = [
  {
    label: 'Shaded',
    Icon: ShadedMode,
    value: 'shaded',
    DesktopSelectedIcon: ShadedModeSelected,
  },
  {
    label: 'Wire',
    Icon: WireMode,
    value: 'wire',
    DesktopSelectedIcon: WireModeSelected,
  },
  {
    label: 'Xray',
    Icon: XRayMode,
    value: 'xray',
    DesktopSelectedIcon: XRayModeSelected,
  },
]

const noop = () => null

const DrawModeDropdown = ({ onClick = noop, handleChange = noop, selectedValue }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const DrawIcon = useMemo(() => {
    return options.find(opt => opt.value === selectedValue).DesktopSelectedIcon
  }, [selectedValue])

  const DrawMobileIcon = useMemo(() => {
    return options.find(opt => opt.value === selectedValue).Icon
  }, [selectedValue])

  const handleOnClick = useCallback(() => {
    dispatch(types.OPEN_ACTION_BAR, {
      Component: DrawModeActionMenu,
      data: {
        selectedValue,
        handleChange,
      },
    })
    onClick()
  }, [dispatch, handleChange, onClick, selectedValue])

  return (
    <div className={c.DrawModeDropdown_ClickableButton} onClick={handleOnClick}>
      <DrawIcon className={c.DrawModeDropdown__desktop} />
      <DrawMobileIcon className={c.DrawModeDropdown__mobile} />
      <Spacer size={'.5rem'} className={c.DrawModeDropdown__desktop} />
      <ArrowDownIcon className={c.DrawModeDropdown__desktop} />
    </div>
  )
}

const DrawModeMenu = ({ handleChange = noop }) => {
  const c = useStyles({})

  return (
    <>
      <Spacer className={c.DrawModeDropdown__mobile} size={'2rem'} />
      <div>
        {options.map((option, ind) => {
          const { Icon = noop } = option
          return (
            <React.Fragment key={`drawmodes_${ind}`}>
              <DropdownItem
                onClick={() => handleChange(option.value)}
                className={c.DrawModeDropdown_Item}
              >
                <div className={c.DrawModeDropdown_Row}>
                  <Icon />
                  <Spacer size={'.75rem'} />
                  <LabelText>{option.label}</LabelText>
                </div>
                <ArrowRightIcon className={c.DrawModeDropdown__mobile} />
              </DropdownItem>
              <Spacer className={c.DrawModeDropdown__mobile} size={'2rem'} />
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}

const DrawModeDropdownMenu = ({ className, handleChange = noop, selectedValue }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={classnames(c.DrawModeDropdown, className)}
      TargetComponent={DrawModeDropdown}
      TargetComponentProps={{ selectedValue, handleChange }}
    >
      <DrawModeMenu handleChange={handleChange} />
    </DropdownMenu>
  )
}

const DrawModeActionMenu = ({ handleChange = noop }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const handleSelect = useCallback(
    value => {
      handleChange(value)
      dispatch(types.CLOSE_ACTION_BAR)
    },
    [dispatch, handleChange]
  )

  return (
    <>
      <Spacer size={'2rem'} />
      <div className={c.DrawModeDropdown_ActionMenu}>
        <Spacer size={'2rem'} />
        <TitleTertiary>Select rendering</TitleTertiary>
        <DrawModeMenu handleChange={handleSelect} />
      </div>
      <Spacer size={'2rem'} />
    </>
  )
}

export default DrawModeDropdownMenu
