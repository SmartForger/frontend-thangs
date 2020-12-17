import React, { useMemo } from 'react'
import { DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as WireModeSelected } from '@svg/view-mode-wire-selected.svg'
import { ReactComponent as ShadedModeSelected } from '@svg/view-mode-shaded-selected.svg'
import { ReactComponent as XRayModeSelected } from '@svg/view-mode-xray-selected.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    DrawModeDropdown: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
    },
    DrawModeDropdown_Arrow: {
      '& > path': {},
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
    },
    DrawModeDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    DrawModeDropdown__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    DrawModeDropdown__mobile: {
      display: 'flex',

      [md]: {
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

const DrawModeDropdown = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})

  const DrawIcon = useMemo(() => {
    return options.find(opt => opt.value === selectedValue).DesktopSelectedIcon
  }, [selectedValue])

  const DrawMobileIcon = useMemo(() => {
    return options.find(opt => opt.value === selectedValue).Icon
  }, [selectedValue])

  return (
    <div className={c.DrawModeDropdown_ClickableButton} onClick={onClick}>
      <DrawIcon className={c.DrawModeDropdown__desktop} />
      <DrawMobileIcon className={c.DrawModeDropdown__mobile} />
      <Spacer size={'.5rem'} className={c.DrawModeDropdown__desktop} />
      <ArrowDownIcon
        className={classnames(c.DrawModeDropdown_Arrow, c.DrawModeDropdown__desktop)}
      />
    </div>
  )
}

const DrawModeDropdownMenu = ({ handleChange = noop, selectedValue }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.DrawModeDropdown}
      TargetComponent={DrawModeDropdown}
      TargetComponentProps={{ selectedValue }}
    >
      <div>
        {options.map((option, ind) => {
          const { Icon = noop } = option
          return (
            <>
              <DropdownItem
                key={`drawmodes_${ind}`}
                onClick={() => handleChange(option.value)}
              >
                <div className={c.DrawModeDropdown_Row}>
                  <Icon />
                  <Spacer size={'.75rem'} />
                  <LabelText>{option.label}</LabelText>
                </div>
              </DropdownItem>
            </>
          )
        })}
      </div>
    </DropdownMenu>
  )
}

export default DrawModeDropdownMenu
