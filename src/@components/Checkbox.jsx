import React from 'react'
import { ReactComponent as Checkmark } from '@svg/checkbox-check.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    Checkbox: {
      background: theme.colors.white[400],
      border: `1px solid ${theme.colors.grey[300]}`,
      borderRadius: '.25rem',
      height: '1rem',
      width: '1rem',
    },
    Checkbox__checked: {
      background: theme.colors.black[500],

      '& > svg:after': {
        display: 'block',
      },
    },
    Checkbox_Checkmark: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '1rem',
      width: '1rem',

      '&:after': {
        content: '',
        position: 'absolute',
        display: 'none',
      },
    },
  }
})
const noop = () => null
const Checkbox = ({ id, name, checked, onClick = noop }) => {
  const c = useStyles({})
  return (
    <label>
      <input
        className={classnames(c.Checkbox, { [c.Checkbox__checked]: checked })}
        type='checkbox'
        id={id}
        name={name}
        checked={checked}
        onClick={onClick}
      />
      <Checkmark className={c.Checkbox_Checkmark} />
    </label>
  )
}

export default Checkbox
