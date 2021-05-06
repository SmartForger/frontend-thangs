import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ActionMenu, ContainerRow, Spacer } from '@components'
import * as sortTypes from '@constants/sortTypes'
import * as R from 'ramda'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    SelectPartToVersionSortActionMenu: {},
    SelectPartToVersionSortActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    SelectPartToVersionSortActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    SelectPartToVersionSortActionMenu__mobile: {
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

const SelectPartToVersionSortTarget = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})
  return (
    <ContainerRow
      className={c.SelectPartToVersionSort_ClickableButton}
      alignItems={'center'}
      onClick={onClick}
    >
      <Metadata type={MetadataType.secondary}>Sort By</Metadata>
      <Spacer size={'.125rem'} />
      <Metadata type={MetadataType.secondary}>{label(selectedValue)}</Metadata>
      <Spacer size={'.125rem'} />
      <ArrowDownIcon />
    </ContainerRow>
  )
}

const SelectPartToVersionSortActionMenu = ({ onChange = noop, selectedValue }) => {
  const menuProps = useMemo(() => {
    return { onChange, actionBarTitle: 'Select sort', options, tabletLayout: false }
  }, [onChange])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={SelectPartToVersionSortTarget}
      TargetComponentProps={targetProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default SelectPartToVersionSortActionMenu
