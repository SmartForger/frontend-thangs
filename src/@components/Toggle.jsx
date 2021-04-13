import React from 'react'
import ReactTooltip from 'react-tooltip'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    ToggleSwitch: {
      display: 'flex',
      flexDirection: 'column',
    },
    ToggleRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      opacity: ({ disabled }) => (disabled ? '.6' : '1'),
    },
    Toggle_Checkbox: {
      height: 0,
      width: 0,
      visibility: 'hidden',

      '&:checked + label span': {
        left: 'calc(100% - .25rem)',
        transform: 'translateX(-100%)',
      },
    },
    Toggle_Label: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      width: '2.4375rem',
      height: '1.5rem',
      backgroundColor: ({ checked }) =>
        checked ? theme.colors.black[500] : theme.colors.grey[300],
      borderRadius: 100,
      position: 'relative',
      transition: 'background-color .2s',

      '&:active > span': {
        width: ({ disabled }) => (disabled ? '15px' : '1.5rem'),
      },
    },
    Toggle_Button: {
      content: '',
      position: 'absolute',
      top: '.25rem',
      left: '.25rem',
      width: 15,
      height: 15,
      borderRadius: 45,
      transition: '0.2s',
      background: '#fff',
      boxShadow: '0 0 2px 0 rgba(10, 10, 10, 0.29)',
    },
  }
})

const noop = () => null
const Toggle = ({ name, checked, onChange = noop, disabled, hoverTooltip }) => {
  const c = useStyles({ checked, disabled })
  const handleKeyPress = e => {
    if (e.keyCode !== 32 || disabled) return

    e.preventDefault()
    onChange(!checked)
  }

  return (
    <>
      <input
        name={name}
        className={c.Toggle_Checkbox}
        id={`toggle-switch-${name}`}
        type='checkbox'
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <label
        className={c.Toggle_Label}
        htmlFor={`toggle-switch-${name}`}
        data-for={'disabled-toggle'}
        data-tip={hoverTooltip}
      >
        <span onKeyDown={e => handleKeyPress(e)} className={c.Toggle_Button} />
      </label>
    </>
  )
}

const ToggleSwitch = ({
  name,
  label,
  checked,
  onChange = noop,
  disabled,
  hoverTooltip = '',
}) => {
  const c = useStyles({ checked, disabled })
  return (
    <div className={c.ToggleSwitch}>
      <Spacer size={'1rem'} />
      <div className={c.ToggleRow}>
        <Body>{label}</Body>
        <Toggle
          name={name}
          checked={checked}
          onChange={onChange}
          label={label}
          disabled={disabled}
          hoverTooltip={hoverTooltip}
        />
      </div>
      {hoverTooltip && (
        <ReactTooltip
          id={'disabled-toggle'}
          className={c.FeedbackTooltip_Message}
          place={'top'}
          effect='solid'
        />
      )}
      <Spacer size={'1rem'} />
    </div>
  )
}

export default ToggleSwitch
