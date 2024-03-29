import React, { useMemo } from 'react'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ActionMenu, Pill, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as sortTypes from '@constants/sortTypes'
import * as R from 'ramda'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    LandingSortActionMenu: {},
    LandingSortActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    LandingSortActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    LandingSortActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const options = [
  {
    label: 'Popular',
    value: sortTypes.likes,
  },
  {
    label: 'Trending',
    value: sortTypes.trending,
  },
  {
    label: 'New',
    value: sortTypes.date,
  },
  {
    label: 'Downloads',
    value: sortTypes.downloaded,
  },
]

const label = selectedValue => {
  const selectedSort = R.find(R.propEq('value', selectedValue))(options)
  if (selectedSort) {
    return selectedSort.label
  }
  return 'Models'
}

const LandingSortTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  return (
    <Pill className={c.LandingSort_ClickableButton} onClick={onClick}>
      <ArrowDownIcon />
      <Spacer size={'.5rem'} />
      {label(selectedValue)}
    </Pill>
  )
}

const LandingSortActionMenu = ({ onChange = noop, selectedValue }) => {
  const menuProps = useMemo(() => {
    return { onChange, actionBarTitle: 'Select sort', options, tabletLayout: false }
  }, [onChange])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={LandingSortTarget}
      TargetComponentProps={targetProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default LandingSortActionMenu
