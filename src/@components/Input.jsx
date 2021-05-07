import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { ContainerRow, TextInput, Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Input: {
      width: '100%',
    },
    TextInput: {
      width: '100%',
    },
    Input_ErrorWrapper: {},
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
      <ContainerRow alignItems='center'>
        <label htmlFor={name}>
          <Metadata
            className={classnames({ [c.Input_ErrorMessage]: !!errorMessage })}
            type={MetadataType.secondary}
          >
            {label}
          </Metadata>
        </label>
        {!!errorMessage && (
          <>
            <Spacer size={'.5rem'} />
            <Metadata type={MetadataType.secondary} className={c.Input_ErrorMessage}>
              {errorMessage}
            </Metadata>
          </>
        )}
      </ContainerRow>
      <Spacer size='0.5rem' />
      <TextInput
        autoComplete={autoComplete}
        className={c.TextInput}
        data-cy={`cy_${id}`}
        id={id}
        inputRef={inputRef}
        maxLength={maxLength}
        name={name}
        onChange={e => onChange(name, e.target.value)}
        required={required}
        type={type}
        value={value}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export default Input
