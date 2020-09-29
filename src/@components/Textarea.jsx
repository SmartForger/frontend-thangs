import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Textarea: {
      width: '100%',
      borderColor: ({ invalid }) =>
        invalid ? theme.colors.error : theme.colors.grey[100],
      borderWidth: ({ invalid }) => (invalid ? '2px' : '1px'),
      color: ({ invalid }) =>
        invalid ? theme.colors.error : theme.variables.colors.textInput,
      padding: '.5rem .75rem',
      display: 'inline-block',
      borderStyle: 'solid',
      borderRadius: '.5rem',
      boxSizing: 'border-box',
      lineHeight: '1rem',
      fontWeight: '500',
      outline: 'none',
      height: '100%',
      '&::placeholder': {
        color: theme.variables.colors.textInputPlaceholderColor,
      },
      '&:focus, &:active': {
        borderColor: theme.colors.gold[500],
      },
    },
  }
})

const noop = () => null
const Textarea = ({
  autoComplete,
  className,
  id,
  label,
  maxLength = 4000,
  name,
  onChange = noop,
  required = false,
  type = 'text',
  value = '',
  error,
  validator,
}) => {
  const [valid, setValid] = useState(true)
  const c = useStyles({ invalid: !valid || error })

  const handleValidation = useCallback(() => {
    if (validator && typeof validator === 'function') {
      setValid(validator())
    }
  }, [validator])

  return (
    <div className={classnames(className)}>
      <textarea
        autoComplete={autoComplete}
        className={c.Textarea}
        data-cy={`cy_${id}`}
        id={id}
        maxLength={maxLength}
        name={name}
        onChange={e => onChange(name, e.target.value)}
        placeholder={label}
        required={required}
        type={type}
        value={value}
        onBlur={handleValidation}
      />
    </div>
  )
}

export default Textarea
