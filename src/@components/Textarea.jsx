import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Textarea: {
      borderColor: ({ invalid }) =>
        invalid ? theme.colors.error : theme.colors.grey[300],
      borderWidth: ({ invalid }) => (invalid ? '2px' : '1px'),
      color: ({ invalid }) =>
        invalid ? theme.colors.error : theme.variables.colors.textInput,
      borderRadius: '.5rem',
      borderStyle: 'solid',
      boxSizing: 'border-box',
      display: 'inline-block',
      fontWeight: '500',
      height: '100%',
      lineHeight: '1rem',
      maxWidth: '100%',
      minHeight: '6rem',
      outline: 'none',
      padding: '.5rem .75rem',
      width: '100%',
      '&::placeholder': {
        color: theme.variables.colors.textInputPlaceholderColor,
      },
      '&:focus, &:active': {
        borderColor: theme.colors.gold[500],
      },
    },
    Textarea_ErrorWrapper: {
      display: 'flex',
    },
    Textarea_ErrorMessage: {
      color: theme.colors.error,
    },
  }
})

const noop = () => null
const Textarea = ({
  autoComplete,
  className,
  disabled,
  error,
  errorMessage,
  id,
  label,
  maxLength = 4000,
  name,
  onChange = noop,
  required = false,
  type = 'text',
  validator,
  value = '',
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
      <label htmlFor={name}>
        <Metadata type={MetadataType.secondary}>{label}</Metadata>
      </label>
      <Spacer size='0.5rem' />
      <textarea
        autoComplete={autoComplete}
        className={c.Textarea}
        data-cy={`cy_${id}`}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={name}
        onBlur={handleValidation}
        onChange={e => onChange(name, e.target.value)}
        required={required}
        type={type}
        value={value}
      />
      {errorMessage && (
        <>
          <Spacer size={'.5rem'} />
          <div className={c.Textarea_ErrorWrapper}>
            <Spacer size={'.25rem'} />
            <Metadata type={MetadataType.secondary} className={c.Textarea_ErrorMessage}>
              {errorMessage}
            </Metadata>
          </div>
        </>
      )}
    </div>
  )
}

export default Textarea
