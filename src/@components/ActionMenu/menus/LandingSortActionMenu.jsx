import React from 'react'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ActionMenu, Pill, Spacer } from '@components'
import { createUseStyles } from '@style'
import * as sortTypes from '@constants/sortTypes'

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

const label = sortBy => {
  switch (sortBy) {
    case sortTypes.likes:
      return 'Popular'
    case sortTypes.trending:
      return 'Trending'
    case sortTypes.date:
      return 'New'
    case sortTypes.downloaded:
      return 'Downloads'
    default:
      return 'Models'
  }
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
  return (
    <ActionMenu
      MenuComponentProps={{ onChange, actionBarTitle: 'Select sort', options }}
      TargetComponent={LandingSortTarget}
      TargetComponentProps={{ selectedValue }}
      isCloseOnSelect={true}
    />
  )
}

export default LandingSortActionMenu
