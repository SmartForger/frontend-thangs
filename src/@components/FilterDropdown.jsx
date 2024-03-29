import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Label } from '@physna/voxel-ui/@atoms/Typography'

import { Pill, DropdownMenu, DropdownItem, Spacer } from '@components'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'

const useStyles = createUseStyles(theme => {
  return {
    FilterDropdown: {
      width: 'auto',
      right: 0,
    },
    FilterDropdown_Arrow: {
      '& > path': {},
    },
    FilterDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    FilterDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    FilterDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    FilterDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

const noop = () => null
export const FilterDropdownMenu = ({ options = [], TargetComponent, label }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.FilterDropdown}
      TargetComponent={TargetComponent}
      label={label}
    >
      <div>
        {options.map((option, ind) => {
          const isLast = ind === options.length - 1
          return (
            <React.Fragment key={`filter-sort_${ind}`}>
              <DropdownItem onClick={option.onClick}>
                <Spacer size={'.5rem'} />
                <div>
                  <Spacer size={'.5rem'} />
                  <Label>{option.label}</Label>
                  <Spacer size={'.5rem'} />
                </div>
                <Spacer size={'.5rem'} />
              </DropdownItem>
              {!isLast && <Spacer size={'.25rem'} />}
            </React.Fragment>
          )
        })}
      </div>
    </DropdownMenu>
  )
}

export const FilterDropdown = ({ onClick = noop, label }) => {
  const c = useStyles({})

  return (
    <Pill className={c.FilterDropdown_ClickableButton} onClick={onClick}>
      <ArrowDownIcon className={c.FilterDropdown_Arrow} />
      <Spacer size={'.5rem'} />
      {label}
    </Pill>
  )
}
