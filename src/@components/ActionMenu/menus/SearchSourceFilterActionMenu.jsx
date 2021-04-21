import React, { useMemo } from 'react'
import * as R from 'ramda'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { ActionMenu, Pill, Spacer, Tabs } from '@components'

import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'

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
    label: 'Best Match',
    value: 'all',
  },
  {
    label: 'Thangs',
    value: 'thangs',
  },
  {
    label: 'External',
    value: 'phyn',
  },
]

const label = selectedValue => {
  const selectedSort = R.find(R.propEq('value', selectedValue))(options)
  if (selectedSort) {
    return selectedSort.label
  }
  return 'Best Match'
}

const SearchSourceFilterTarget = ({
  onClick = noop,
  onChange = noop,
  selectedValue,
  disabled,
  thin,
  targetVariant,
}) => {
  const c = useStyles({})
  if (targetVariant === 'tabs') {
    const defaultValue = {
      label: 'Best Match',
      value: 'all',
    }
    return (
      <Tabs
        disabled={disabled}
        options={options}
        onChange={onChange}
        selectedValue={selectedValue || defaultValue}
      />
    )
  }
  return (
    <>
      <Spacer width='.25rem' height='0' />
      <Pill tertiary thin={thin} onClick={disabled ? noop : onClick}>
        {thin ? (
          <Metadata
            type={MetadataType.secondary}
            className={c.SearchSourceFilterActionMenu_Text}
          >
            {label(selectedValue)}
          </Metadata>
        ) : (
          <>{label(selectedValue)}</>
        )}
        <Spacer width='.25rem' height='0' />
        <ArrowDownIcon className={c.SearchSourceFilter_DownArrow} />
      </Pill>
    </>
  )
}

const SearchSourceFilterActionMenu = ({
  onChange = noop,
  selectedValue,
  className = '',
  disabled = false,
  thin = false,
  targetVariant = 'dots',
}) => {
  const menuProps = useMemo(() => {
    return {
      onChange: disabled ? noop : onChange,
      actionBarTitle: 'Select Search Filter',
      options,
      tabletLayout: false,
      containerClassName: className,
    }
  }, [disabled, onChange, className])

  const targetProps = useMemo(() => {
    return {
      disabled,
      selectedValue,
      thin,
      targetVariant,
      onChange: disabled ? noop : onChange,
    }
  }, [disabled, onChange, selectedValue, targetVariant, thin])

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
