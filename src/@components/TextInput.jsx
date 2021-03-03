import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    TextInput: {
      borderColor: ({ invalid }) =>
        invalid ? theme.colors.error : theme.colors.grey[100],
      borderWidth: ({ invalid }) => (invalid ? '2px' : '1px'),
      color: ({ invalid }) =>
        invalid ? theme.colors.error : theme.variables.colors.textInput,
      padding: '.6875rem 1rem',
      display: 'inline-block',
      borderStyle: 'solid',
      borderRadius: '.5rem',
      boxSizing: 'border-box',
      lineHeight: '1rem',
      fontWeight: '500',
      outline: 'none',
      '&::placeholder': {
        color: theme.variables.colors.textInputPlaceholderColor,
      },
      '&:focus, &:active': {
        borderColor: theme.colors.gold[500],
      },
    },
  }
})

const TextInput = ({ className, validator, error, inputRef, ...props }) => {
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
      ref={inputRef}
      className={classnames(c.TextInput, className)}
      onBlur={handleValidation}
    />
  )
}

export default TextInput
