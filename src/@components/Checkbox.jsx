import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { ReactComponent as Checkmark } from '@svg/checkbox-check.svg'

const useStyles = createUseStyles(theme => {
  return {
    Container: {
      borderRadius: '.25rem',
      display: 'block',
      position: 'relative',
      paddingLeft: '1rem',
      marginBottom: '1rem',
      cursor: 'pointer',
      fontSize: 22,
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none',

      '& input': {
        position: 'absolute',
        opacity: '0',
        cursor: 'pointer',
        height: 0,
        width: 0,
      },

      '& input:checked ~ span': {
        backgroundColor: theme.colors.black[500],
      },

      '&:hover': {
        '& input:checked ~ span': {
          backgroundColor: '#2196F3',
        },
        '& input:checked ~ span:after': {
          display: 'block',
        },
      },
    },
    Checkmark: {
      alignItems: 'center',
      backgroundColor: theme.colors.white[400],
      border: ({ checked }) => (checked ? 'none' : `1px solid ${theme.colors.grey[300]}`),
      borderRadius: '.25rem',
      boxSizing: 'border-box',
      display: 'flex',
      height: '1rem',
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '1rem',
    },
    Checkbox: {
      position: 'absolute',
      opacity: '0',
      cursor: 'pointer',
      height: 0,
      width: 0,
    },
    Checkbox_Bar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    Checkbox__checked: {
      background: theme.colors.black[500],

      '& > svg:after': {
        display: 'block',
      },
    },
  }
})

const noop = () => null
const Checkbox = ({ id, name, checked, onChange = noop }) => {
  const c = useStyles({ checked })
  return (
    <label className={c.Container}>
      <input
        className={classnames(c.Checkbox, { [c.Checkbox__checked]: checked })}
        type='checkbox'
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className={c.Checkmark}>{checked && <Checkmark />}</span>
    </label>
  )
}

const CheckboxWidthLabel = ({ label, ...props }) => {
  const c = useStyles({})

  return (
    <div className={c.Checkbox_Bar}>
      <Body>{label}</Body>
      <Checkbox {...props} />
    </div>
  )
}

export default CheckboxWidthLabel
