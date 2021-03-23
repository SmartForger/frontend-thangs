import React, { useMemo } from 'react'
import { ActionMenu, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
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

import { ReactComponent as TopLeftBackViewIcon } from '@svg/view-topleftback-icon.svg'
import { ReactComponent as TopRightBackViewIcon } from '@svg/view-toprightback-icon.svg'
import { ReactComponent as TopLeftFrontViewIcon } from '@svg/view-topleftfront-icon.svg'
import { ReactComponent as TopRightFrontViewIcon } from '@svg/view-toprightfront-icon.svg'
import { ReactComponent as BottomLeftBackViewIcon } from '@svg/view-bottomleftback-icon.svg'
import { ReactComponent as BottomRightBackViewIcon } from '@svg/view-bottomrightback-icon.svg'
import { ReactComponent as BottomLeftFrontViewIcon } from '@svg/view-bottomleftfront-icon.svg'
import { ReactComponent as BottomRightFrontViewIcon } from '@svg/view-bottomrightfront-icon.svg'

import { ReactComponent as TopLeftBackViewSelected } from '@svg/view-topleftback-icon-selected.svg'
import { ReactComponent as TopRightBackViewSelected } from '@svg/view-toprightback-icon-selected.svg'
import { ReactComponent as TopLeftFrontViewSelected } from '@svg/view-topleftfront-icon-selected.svg'
import { ReactComponent as TopRightFrontViewSelected } from '@svg/view-toprightfront-icon-selected.svg'
import { ReactComponent as BottomLeftBackViewSelected } from '@svg/view-bottomleftback-icon-selected.svg'
import { ReactComponent as BottomRightBackViewSelected } from '@svg/view-bottomrightback-icon-selected.svg'
import { ReactComponent as BottomLeftFrontViewSelected } from '@svg/view-bottomleftfront-icon-selected.svg'
import { ReactComponent as BottomRightFrontViewSelected } from '@svg/view-bottomrightfront-icon-selected.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
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
  {
    label: 'TopLeftBack',
    Icon: TopLeftBackViewIcon,
    value: 'TopLeftBack',
    DesktopSelectedIcon: TopLeftBackViewSelected,
  },
  {
    label: 'TopRightBack',
    Icon: TopRightBackViewIcon,
    value: 'TopRightBack',
    DesktopSelectedIcon: TopRightBackViewSelected,
  },
  {
    label: 'TopRightFront',
    Icon: TopRightFrontViewIcon,
    value: 'TopRightFront',
    DesktopSelectedIcon: TopRightFrontViewSelected,
  },
  {
    label: 'TopLeftFront',
    Icon: TopLeftFrontViewIcon,
    value: 'TopLeftFront',
    DesktopSelectedIcon: TopLeftFrontViewSelected,
  },
  {
    label: 'BottomLeftBack',
    Icon: BottomLeftBackViewIcon,
    value: 'BottomLeftBack',
    DesktopSelectedIcon: BottomLeftBackViewSelected,
  },
  {
    label: 'BottomRightBack',
    Icon: BottomRightBackViewIcon,
    value: 'BottomRightBack',
    DesktopSelectedIcon: BottomRightBackViewSelected,
  },
  {
    label: 'BottomRightFront',
    Icon: BottomRightFrontViewIcon,
    value: 'BottomRightFront',
    DesktopSelectedIcon: BottomRightFrontViewSelected,
  },
  {
    label: 'BottomLeftFront',
    Icon: BottomLeftFrontViewIcon,
    value: 'BottomLeftFront',
    DesktopSelectedIcon: BottomLeftFrontViewSelected,
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
