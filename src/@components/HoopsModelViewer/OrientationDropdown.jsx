import React from 'react'
import { Pill, DropdownMenu, DropdownItem, Spacer, LabelText, SingleLineBodyText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'

const useStyles = createUseStyles(theme => {
  return {
    OrientationDropdown: {
      width: 'auto',
      right: 0,
    },
    OrientationDropdown_Arrow: {
      '& > path': {},
    },
    OrientationDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    OrientationDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    OrientationDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    OrientationDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    }
  }
})

const noop = () => null
export const OrientationDropdownMenu = ({ options = [], TargetComponent, label }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.OrientationDropdown}
      TargetComponent={TargetComponent}
      label={label}
    >
      <div>
        {options.map((option, ind) => {
          const isLast = ind === options.length - 1
          return (
            <>
              <DropdownItem key={`sort_${ind}`} onClick={option.onClick}>
                <Spacer size={'.5rem'} />
                <div>
                  <Spacer size={'.5rem'} />
                  <LabelText>{option.label}</LabelText>
                  <Spacer size={'.5rem'} />
                </div>
                <Spacer size={'.5rem'} />
              </DropdownItem>
              {!isLast && <Spacer size={'.25rem'} />}
            </>
          )
        })}
      </div>
    </DropdownMenu>
  )
}

export const OrientationDropdown = ({ onClick = noop, label }) => {
  const c = useStyles({})

  return (
    <div className={c.OrientationDropdown_ClickableButton} onClick={onClick}>
      <SingleLineBodyText>{label}</SingleLineBodyText>
      <Spacer size={'.5rem'} />
      <ArrowDownIcon className={c.OrientationDropdown_Arrow} />
    </div>
  )
}
