import React, { useMemo } from 'react'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ActionMenu, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui'
import * as R from 'ramda'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    SearchSourceFilterActionMenu: {},
    SearchSourceFilter_ClickableButton: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      borderBottom: '1px solid',
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
    SearchSourceFilter_DownArrow: {
      '& path': {
        fill: '#999999',
      },
    },
  }
})

const noop = () => null

const options = [
  {
    label: 'All',
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
    <>
      <Spacer size='.25rem' />
      <div className={c.SearchSourceFilter_ClickableButton} onClick={onClick}>
        <ArrowDownIcon className={c.SearchSourceFilter_DownArrow} />
        <Spacer size='.25rem' />
        {label(selectedValue)}
      </div>
    </>
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
