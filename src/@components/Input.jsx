import React from 'react'
import classnames from 'classnames'
import { TextInput } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Input: {
      width: '100%',
    },
    TextInput: {
      width: '100%',
    },
  }
})

const noop = () => null
const Input = ({
  autoComplete,
  className,
  id,
  inputRef,
  label,
  maxLength = 500,
  name,
  onChange = noop,
  required = false,
  type = 'text',
  value = '',
  disabled,
}) => {
  const c = useStyles()
  return (
    <div className={classnames(className, c.Input)}>
      <TextInput
        autoComplete={autoComplete}
        className={c.TextInput}
        data-cy={`cy_${id}`}
        id={id}
        inputRef={inputRef}
        maxLength={maxLength}
        name={name}
        onChange={e => onChange(name, e.target.value)}
        placeholder={label}
        required={required}
        type={type}
        value={value}
        disabled={disabled}
      />
    </div>
  )
}

export default Input
