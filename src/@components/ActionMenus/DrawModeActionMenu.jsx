import React, { useMemo } from 'react'
import { ActionMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as WireModeSelected } from '@svg/view-mode-wire-selected.svg'
import { ReactComponent as ShadedModeSelected } from '@svg/view-mode-shaded-selected.svg'
import { ReactComponent as XRayModeSelected } from '@svg/view-mode-xray-selected.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    DrawModeActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    DrawModeActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    DrawModeActionMenu_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    DrawModeActionMenu_Item: {
      justifyContent: 'space-between',
    },
    DrawModeActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    DrawModeActionMenu__mobile: {
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
    label: 'X-Ray',
    Icon: XRayMode,
    value: 'xray',
    DesktopSelectedIcon: XRayModeSelected,
  },
]

const noop = () => null

const DrawModeMenu = ({ onChange = noop }) => {
  const c = useStyles({})
  return (
    <div>
      {options.map((option, ind) => {
        const { Icon = noop } = option
        return (
          <React.Fragment key={`drawmodes_${ind}`}>
            <DropdownItem
              onClick={() => onChange(option.value)}
              className={c.DrawModeActionMenu_Item}
            >
              <div className={c.DrawModeActionMenu_Row}>
                <Icon />
                <Spacer size={'.75rem'} />
                <LabelText>{option.label}</LabelText>
              </div>
              <ArrowRightIcon className={c.DrawModeActionMenu__mobile} />
            </DropdownItem>
            <Spacer className={c.DrawModeActionMenu__desktop} size={'.25rem'} />
            <Spacer className={c.DrawModeActionMenu__mobile} size={'2rem'} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

const DrawModeTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  const value = useMemo(() => {
    return selectedValue || options[0].value
  }, [selectedValue])

  const DrawIcon = useMemo(() => {
    return options.find(opt => opt.value === value).DesktopSelectedIcon
  }, [value])

  const DrawMobileIcon = useMemo(() => {
    return options.find(opt => opt.value === value).Icon
  }, [value])

  return (
    <div className={c.DrawModeActionMenu_ClickableButton} onClick={onClick}>
      <DrawIcon className={c.DrawModeActionMenu__desktop} />
      <DrawMobileIcon className={c.DrawModeActionMenu__mobile} />
      <Spacer size={'.5rem'} className={c.DrawModeActionMenu__desktop} />
      <ArrowDownIcon className={c.DrawModeActionMenu__desktop} />
    </div>
  )
}

const DrawModeActionMenu = ({ onChange = noop, selectedValue }) => {
  return (
    <ActionMenu
      MenuComponent={DrawModeMenu}
      MenuComponentProps={{ onChange, actionBarTitle: 'Select Rendering' }}
      TargetComponent={DrawModeTarget}
      TargetComponentProps={{ selectedValue }}
    />
  )
}

export default DrawModeActionMenu
