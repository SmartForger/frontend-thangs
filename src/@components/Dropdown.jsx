import React from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import { Spacer, MetadataSecondary } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down.svg'

const useStyles = createUseStyles(theme => {
  return {
    Dropdown: {
      border: ({ error }) =>
        error ? `1px solid ${theme.colors.error}` : '1px solid #ddd',
      borderRadius: '.5rem',
      height: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    Dropdown_Indicator: {
      marginRight: '1rem',
      '& path': {
        fill: theme.colors.grey[300],
      },
    },
    Dropdown_ErrorWrapper: {
      display: 'flex',
    },
    Dropdown_ErrorMessage: {
      color: theme.colors.error,
    },
  }
})

const Dropdown = ({
  className,
  defaultValue,
  error,
  errorMessage,
  isClearable,
  name,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const c = useStyles({ error })

  return (
    <>
      <Select
        className={classnames(className, c.Dropdown)}
        defaultValue={defaultValue}
        isClearable={isClearable}
        name={name}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        value={value}
        components={{
          IndicatorSeparator: () => null,
          // eslint-disable-next-line react/display-name
          DropdownIndicator: () => {
            // cx causes React to throw an error, so we remove it
            return <ArrowDownIcon className={c.Dropdown_Indicator} />
          },
        }}
        styles={{
          control: base => {
            return {
              ...base,
              minHeight: 'auto',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: 'none',
            }
          },
          singleValue: base => {
            return {
              ...base,
              margin: 0,
              color: 'black',
              fontWeight: '500',
            }
          },
          placeholder: base => {
            return {
              ...base,
              margin: 0,
              color: '#999999',
              fontWeight: '500',
            }
          },
          clearIndicator: base => {
            return {
              ...base,
              color: '#999999',
              padding: '7px',
            }
          },
          input: base => {
            return {
              ...base,
              margin: 0,
              padding: 0,
            }
          },
          valueContainer: base => {
            return {
              ...base,
              padding: '0.75rem 1rem',
            }
          },
        }}
      />
      {errorMessage && (
        <>
          <Spacer size={'.5rem'} />
          <div className={c.Dropdown_ErrorWrapper}>
            <Spacer size={'.25rem'} />
            <MetadataSecondary className={c.Dropdown_ErrorMessage}>
              {errorMessage}
            </MetadataSecondary>
          </div>
        </>
      )}
    </>
  )
}

export default Dropdown
