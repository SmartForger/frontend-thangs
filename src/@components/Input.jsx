import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { TextInput, Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Input: {
      width: '100%',
    },
    TextInput: {
      width: '100%',
    },
    Input_ErrorWrapper: {
      display: 'flex',
    },
    Input_ErrorMessage: {
      color: theme.colors.error,
    },
  }
})

const noop = () => null
const Input = ({
  autoComplete,
  className,
  disabled,
  errorMessage,
  id,
  inputRef,
  label,
  maxLength = 500,
  name,
  onChange = noop,
  required = false,
  type = 'text',
  value = '',
  ...props
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
        {...props}
      />
      {errorMessage && (
        <>
          <Spacer size={'.5rem'} />
          <div className={c.Input_ErrorWrapper}>
            <Spacer size={'.25rem'} />
            <Metadata type={MetadataType.secondary} className={c.Input_ErrorMessage}>
              {errorMessage}
            </Metadata>
          </div>
        </>
      )}
    </div>
  )
}

export default Input
