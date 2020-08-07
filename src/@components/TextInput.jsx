import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    TextInput: {
      padding: '.5rem .75rem',
      display: 'inline-block',
      border: '2px solid',
      borderColor: ({ invalid }) => (invalid ? theme.colors.error : 'transparent'),
      borderRadius: '.5rem',
      boxSizing: 'border-box',
      lineHeight: '18px',
      fontWeight: '500',
      backgroundColor: theme.variables.colors.textInputBackground,
      color: ({ invalid }) =>
        invalid ? theme.colors.error : theme.variables.colors.textInput,
      '&::placeholder': {
        color: theme.variables.colors.textInputPlaceholderColor,
      },
    },
  }
})

const TextInput = ({ className, validator, error, ...props }) => {
  const [valid, setValid] = useState(true)
  const c = useStyles({ invalid: !valid || error })

  const handleValidation = useCallback(() => {
    if (validator && typeof validator === 'function') {
      setValid(validator())
    }
  }, [validator])

  return (
    <input
      {...props}
      className={classnames(c.TextInput, className)}
      onBlur={handleValidation}
    />
  )
}

export default TextInput
