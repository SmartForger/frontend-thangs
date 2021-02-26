import React, { useMemo } from 'react'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ActionMenu, Pill, Spacer } from '@components'
import { createUseStyles } from '@style'
import * as R from 'ramda'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    SearchSourceFilterActionMenu: {},
    SearchSourceFilterActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    SearchSourceFilterActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    SearchSourceFilterActionMenu__mobile: {
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
    label: 'Best Overall',
    value: 'all',
  },
  {
    label: 'Thangs Only',
    value: 'thangs',
  },
  {
    label: 'External Only',
    value: 'phyn',
  },
]

const label = selectedValue => {
  const selectedSort = R.find(R.propEq('value', selectedValue))(options)
  if (selectedSort) {
    return selectedSort.label
  }
  return 'All'
}

const SearchSourceFilterTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  return (
    <Pill className={c.SearchSourceFilter_ClickableButton} onClick={onClick}>
      <ArrowDownIcon />
      <Spacer size={'.5rem'} />
      {label(selectedValue)}
    </Pill>
  )
}

const SearchSourceFilterActionMenu = ({ onChange = noop, selectedValue }) => {
  const menuProps = useMemo(() => {
    return {
      onChange,
      actionBarTitle: 'Select Search Filter',
      options,
      tabletLayout: false,
    }
  }, [onChange])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={SearchSourceFilterTarget}
      TargetComponentProps={targetProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default SearchSourceFilterActionMenu
