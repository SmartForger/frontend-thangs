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
    ExactSearchFilterActionMenu_Text: {
      color: theme.colors.black[500],
    },
    ExactSearchFilter_ClickableButton: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
    },
    ExactSearchFilterActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    ExactSearchFilterActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
    ExactSearchFilter_DownArrow: {
      '& path': {
        fill: '#999999',
      },
    },
  }
})

const noop = () => null

const options = [
  {
    label: 'Exact Match',
    value: true,
  },
  {
    label: 'Partial Match',
    value: false,
  },
]

const label = selectedValue => {
  const selectedSort = R.find(R.propEq('value', selectedValue))(options)
  if (selectedSort) {
    return selectedSort.label
  }
  return 'All'
}

const ExactSearchFilterTarget = ({ onClick = noop, selectedValue, thin }) => {
  const c = useStyles({})
  return (
    <>
      <Spacer width='.25rem' />
      <Pill tertiary thin={thin} onClick={onClick}>
        {thin ? (
          <MetadataSecondary className={c.ExactSearchFilterActionMenu_Text}>
            {label(selectedValue)}
          </MetadataSecondary>
        ) : (
          <>{label(selectedValue)}</>
        )}
        <Spacer width='.25rem' />
        <ArrowDownIcon className={c.ExactSearchFilter_DownArrow} />
      </Pill>
    </>
  )
}

const ExactSearchFilterActionMenu = ({
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
      TargetComponent={ExactSearchFilterTarget}
      TargetComponentProps={targetProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ExactSearchFilterActionMenu
