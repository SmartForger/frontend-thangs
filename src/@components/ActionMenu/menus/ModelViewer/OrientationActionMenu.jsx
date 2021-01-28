import React, { useMemo } from 'react'
import { ActionMenu, Spacer } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as TopViewIcon } from '@svg/view-top-icon.svg'
import { ReactComponent as BottomViewIcon } from '@svg/view-bottom-icon.svg'
import { ReactComponent as FrontViewIcon } from '@svg/view-front-icon.svg'
import { ReactComponent as BackViewIcon } from '@svg/view-back-icon.svg'
import { ReactComponent as RightViewIcon } from '@svg/view-right-icon.svg'
import { ReactComponent as LeftViewIcon } from '@svg/view-left-icon.svg'
import { ReactComponent as TopViewSelected } from '@svg/view-top-icon-selected.svg'
import { ReactComponent as BottomViewSelected } from '@svg/view-bottom-icon-selected.svg'
import { ReactComponent as FrontViewSelected } from '@svg/view-front-icon-selected.svg'
import { ReactComponent as BackViewSelected } from '@svg/view-back-icon-selected.svg'
import { ReactComponent as RightViewSelected } from '@svg/view-right-icon-selected.svg'
import { ReactComponent as LeftViewSelected } from '@svg/view-left-icon-selected.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    OrientationActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      bottom: '5rem',
      right: '0',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    OrientationTarget: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      '& > span': {
        display: 'none',

        [md_viewer]: {
          display: 'flex',
        },
      },
    },
    OrientationActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    OrientationActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const options = [
  {
    label: 'Top',
    Icon: TopViewIcon,
    value: 'Top',
    DesktopSelectedIcon: TopViewSelected,
  },
  {
    label: 'Bottom',
    Icon: BottomViewIcon,
    value: 'Bottom',
    DesktopSelectedIcon: BottomViewSelected,
  },
  {
    label: 'Front',
    Icon: FrontViewIcon,
    value: 'Front',
    DesktopSelectedIcon: FrontViewSelected,
  },
  {
    label: 'Back',
    Icon: BackViewIcon,
    value: 'Back',
    DesktopSelectedIcon: BackViewSelected,
  },
  {
    label: 'Right',
    Icon: RightViewIcon,
    value: 'Right',
    DesktopSelectedIcon: RightViewSelected,
  },
  {
    label: 'Left',
    Icon: LeftViewIcon,
    value: 'Left',
    DesktopSelectedIcon: LeftViewSelected,
  },
]

const noop = () => null

const OrientationTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  const value = useMemo(() => {
    return selectedValue || options[0].value
  }, [selectedValue])

  const SelectedOrientationIcon = useMemo(
    () =>
      options.find(opt => opt.value.toLowerCase() === value.toLowerCase())
        .DesktopSelectedIcon,
    [value]
  )

  const SelectedOrientationMobileIcon = useMemo(
    () => options.find(opt => opt.value.toLowerCase() === value.toLowerCase()).Icon,
    [value]
  )

  return (
    <div className={c.OrientationTarget} onClick={onClick}>
      <SelectedOrientationIcon className={c.OrientationActionMenu__desktop} />
      <SelectedOrientationMobileIcon className={c.OrientationActionMenu__mobile} />
      <Spacer size={'.5rem'} className={c.OrientationActionMenu__desktop} />
      <ArrowDownIcon className={c.OrientationActionMenu__desktop} />
      <Spacer size={'1.125rem'} className={c.OrientationActionMenu__desktop} />
    </div>
  )
}

const OrientationActionMenu = ({ onChange = noop, selectedValue }) => {
  const menuProps = useMemo(() => {
    return {
      onChange,
      actionBarTitle: 'Select orientation',
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
      TargetComponent={OrientationTarget}
      TargetComponentProps={targetProps}
      showTop={true}
    />
  )
}

export default OrientationActionMenu
