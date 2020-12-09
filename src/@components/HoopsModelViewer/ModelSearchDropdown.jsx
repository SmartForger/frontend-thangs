import React from 'react'
import {
  Pill,
  DropdownMenu,
  DropdownItem,
  Spacer,
  LabelText,
  SingleLineBodyText,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as RemoveIcon } from '@svg/icon-X.svg'

const useStyles = createUseStyles(theme => {
  return {
    ModelSearchDropdown: {
      width: 'auto',
      right: 0,
    },
    ModelSearchDropdown_Arrow: {
      width: '0.75rem',
      height: '0.75rem',
      '& > path': {
        fill: '#000',
      },
    },
    ModelSearchDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ModelSearchDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    ModelSearchDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    ModelSearchDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

const noop = () => null
export const ModelSearchDropdownMenu = ({
  TargetComponent,
  label,
  canRemove,
  onRemove,
}) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.ModelSearchDropdown}
      TargetComponent={TargetComponent}
      TargetComponentProps={{ canRemove, onRemove }}
      label={label}
    >
      <div>Dropdown</div>
    </DropdownMenu>
  )
}

export const ModelSearchDropdown = ({ onClick = noop, label, canRemove, onRemove }) => {
  const c = useStyles({})

  return (
    <div className={c.ModelSearchDropdown_ClickableButton} onClick={onClick}>
      <SingleLineBodyText>{label}</SingleLineBodyText>
      <Spacer size={'.5rem'} />
      {canRemove && (
        <RemoveIcon
          className={c.ModelSearchDropdown_Arrow}
          onClick={ev => {
            ev.stopPropagation()
            onRemove && onRemove()
          }}
        />
      )}
    </div>
  )
}
