import React, { useMemo } from 'react'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ActionMenu, MetadataSecondary, Pill, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as R from 'ramda'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    SearchSourceFilterActionMenu_Text: {
      color: theme.colors.black[500],
    },
    SearchSourceFilter_ClickableButton: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
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
    label: 'All Sources',
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

const SearchSourceFilterTarget = ({ onClick = noop, selectedValue, disabled, thin }) => {
  const c = useStyles({})
  return (
    <>
      <Spacer width='.25rem' />
      <Pill tertiary thin={thin} onClick={disabled ? noop : onClick}>
        {thin ? (
          <MetadataSecondary className={c.SearchSourceFilterActionMenu_Text}>
            {label(selectedValue)}
          </MetadataSecondary>
        ) : (
          <>{label(selectedValue)}</>
        )}
        <Spacer width='.25rem' />
        <ArrowDownIcon className={c.SearchSourceFilter_DownArrow} />
      </Pill>
    </>
  )
}

const SearchSourceFilterActionMenu = ({
  onChange = noop,
  selectedValue,
  disabled = false,
  thin = false,
}) => {
  const menuProps = useMemo(() => {
    return {
      onChange: disabled ? noop : onChange,
      actionBarTitle: 'Select Search Filter',
      options,
      tabletLayout: false,
    }
  }, [disabled, onChange])

  const targetProps = useMemo(() => {
    return { disabled, selectedValue, thin }
  }, [disabled, selectedValue, thin])

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
