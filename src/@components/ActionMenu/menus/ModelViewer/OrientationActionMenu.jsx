import React, { useMemo } from 'react'
import { ActionMenu, Spacer, SingleLineBodyText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as TopViewIcon } from '@svg/view-top-icon.svg'
import { ReactComponent as FrontViewIcon } from '@svg/view-front-icon.svg'
import { ReactComponent as BackViewIcon } from '@svg/view-back-icon.svg'
import { ReactComponent as RightViewIcon } from '@svg/view-right-icon.svg'
import { ReactComponent as LeftViewIcon } from '@svg/view-left-icon.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    OrientationActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
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
  },
  {
    label: 'Front',
    Icon: FrontViewIcon,
    value: 'Front',
  },
  {
    label: 'Back',
    Icon: BackViewIcon,
    value: 'Back',
  },
  {
    label: 'Right',
    Icon: RightViewIcon,
    value: 'Right',
  },
  {
    label: 'Left',
    Icon: LeftViewIcon,
    value: 'Left',
  },
]

const noop = () => null

const OrientationTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  const value = useMemo(() => {
    return selectedValue || options[0].value
  }, [selectedValue])

  const selectedOrientation = useMemo(
    () => options.find(opt => opt.value.toLowerCase() === value.toLowerCase()).label,
    [value]
  )

  const SelectedOrientationIcon = useMemo(
    () => options.find(opt => opt.value.toLowerCase() === value.toLowerCase()).Icon,
    [value]
  )

  return (
    <div className={c.OrientationTarget} onClick={onClick}>
      <SingleLineBodyText>{selectedOrientation}</SingleLineBodyText>
      <SelectedOrientationIcon className={c.OrientationActionMenu__mobile} />
      <Spacer size={'.5rem'} className={c.OrientationActionMenu__desktop} />
      <ArrowDownIcon className={c.OrientationActionMenu__desktop} />
      <Spacer size={'1.125rem'} className={c.OrientationActionMenu__desktop} />
    </div>
  )
}

const OrientationActionMenu = ({ onChange = noop, selectedValue }) => {
  const menuProps = useMemo(() => {
    return { onChange, actionBarTitle: 'Select orientation', options, tabletLayout: true }
  }, [onChange])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={OrientationTarget}
      TargetComponentProps={targetProps}
    />
  )
}

export default OrientationActionMenu
