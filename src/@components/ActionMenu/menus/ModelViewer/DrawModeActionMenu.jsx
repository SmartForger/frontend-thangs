import React, { useMemo } from 'react'
import { ActionMenu, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
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
      bottom: '5rem',
      right: '0',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    DrawModeActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
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

const DrawModeTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  const value = useMemo(() => {
    return selectedValue || options[0].value
  }, [selectedValue])

  const DrawIcon = useMemo(() => {
    return options.find(opt => opt.value.toLowerCase() === value.toLowerCase())
      .DesktopSelectedIcon
  }, [value])

  const DrawMobileIcon = useMemo(() => {
    return options.find(opt => opt.value.toLowerCase() === value.toLowerCase()).Icon
  }, [value])

  return (
    <div className={c.DrawModeActionMenu_ClickableButton} onClick={onClick}>
      <DrawIcon className={c.DrawModeActionMenu__desktop} />
      <DrawMobileIcon className={c.DrawModeActionMenu__mobile} />
      <Spacer size={'.5rem'} className={c.DrawModeActionMenu__desktop} />
      <ArrowDownIcon className={c.DrawModeActionMenu__desktop} />
      <Spacer size={'1.125rem'} className={c.DrawModeActionMenu__desktop} />
    </div>
  )
}

const DrawModeActionMenu = ({ onChange = noop, selectedValue }) => {
  const menuProps = useMemo(() => {
    return {
      onChange,
      actionBarTitle: 'Select rendering',
      options,
      tabletLayout: true,
    }
  }, [onChange])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={DrawModeTarget}
      TargetComponentProps={targetProps}
      showTop={true}
    />
  )
}

export default DrawModeActionMenu
