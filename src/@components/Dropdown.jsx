import React from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Dropdown: {
      border: '1px solid #ddd',
      borderRadius: '.5rem',
      marginBottom: '.5rem',
    },
    Dropdown_Indicator: {
      width: 0,
      height: 0,
      marginRight: '1rem',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: `8px solid ${theme.colors.purple[900]}`,
    },
  }
})

const Dropdown = ({
  className,
  defaultValue,
  name,
  placeholder,
  isClearable,
  options,
  onChange,
}) => {
  const c = useStyles()

  return (
    <Select
      className={classnames(className, c.Dropdown)}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      options={options}
      onChange={onChange}
      isClearable={isClearable}
      components={{
        IndicatorSeparator: () => null,
        // eslint-disable-next-line react/display-name
        DropdownIndicator: () => {
          // cx causes React to throw an error, so we remove it
          return <div className={c.Dropdown_Indicator} />
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
            padding: '8px 16px',
          }
        },
      }}
    />
  )
}

export default Dropdown
