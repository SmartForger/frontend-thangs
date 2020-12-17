import React from 'react'
import {
  DropdownMenu,
  DropdownItem,
  Spacer,
  LabelText,
  SingleLineBodyText,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUp } from '@svg/icon-arrow-up-sm.svg'

const useStyles = createUseStyles(theme => {
  return {
    ModeDropdown: {
      bottom: '4.5rem',
      right: 0,
      width: 'auto',
    },
    ModeDropdown_Arrow: {
      '& > path': {},
    },
    ModeDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ModeDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    ModeDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    ModeDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    ModeDropdown_Option: {
      display: 'flex',
      flexDirection: 'row',
    },
    ModeDropdown_Icon: {
      width: 'unset !important',
      margin: 0,
    },
  }
})

const noop = () => null
export const ModeDropdownMenu = ({ options = [], TargetComponent, label, Icon }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.ModeDropdown}
      TargetComponent={TargetComponent}
      label={label}
      Icon={Icon}
    >
      <div>
        {options.map((option, ind) => {
          const isLast = ind === options.length - 1
          const { Icon } = option
          return (
            <>
              <DropdownItem key={`sort_${ind}`} onClick={option.onClick}>
                <div className={c.ModeDropdown_Option}>
                  <Icon className={c.ModeDropdown_Icon} />
                  <Spacer size={'.25rem'} />
                  <LabelText>{option.label}</LabelText>
                </div>
              </DropdownItem>
              {!isLast && <Spacer size={'.5rem'} />}
            </>
          )
        })}
      </div>
    </DropdownMenu>
  )
}

export const ModeDropdown = ({ onClick = noop, label, Icon }) => {
  const c = useStyles({})

  return (
    <div className={c.ModeDropdown_ClickableButton} onClick={onClick}>
      {Icon && <Icon />}
      {label && <SingleLineBodyText>{label}</SingleLineBodyText>}
      <Spacer size={'.5rem'} />
      <ArrowUp className={c.ModeDropdown_Arrow} />
    </div>
  )
}
