import React from 'react'
import Select from 'react-select'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    CategorySelect: {},
    CategorySelect_DropdownIndicator: {
      width: 0,
      height: 0,
      marginRight: '1rem',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',

      /* We unfortunately need to hardcode this value because of how react-select works */
      borderTop: '8px solid #f5f5f5',
    },
  }
})

const CATEGORIES = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'home', label: 'Home' },
  { value: 'safety', label: 'Safety' },
  { value: 'characters', label: 'Characters' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'technology', label: 'Technology' },
  { value: 'hobbyist', label: 'Hobbyist' },
]

const CategorySelect = ({ setCategory }) => {
  const c = useStyles()
  return (
    <Select
      name='category'
      placeholder='Select Category'
      isClearable
      options={CATEGORIES}
      onChange={({ value }) => setCategory(value)}
      components={{
        IndicatorSeparator: () => null,
        // eslint-disable-next-line react/display-name
        DropdownIndicator: () => {
          // cx causes React to throw an error, so we remove it
          return <div className={c.CategorySelect_DropdownIndicator} />
        },
      }}
      styles={{
        control: base => {
          return {
            ...base,
            minHeight: 'auto',
            borderRadius: '.5rem',
            backgroundColor: '#616168',
            border: 'none',
          }
        },
        singleValue: base => {
          return {
            ...base,
            margin: 0,
            color: '#f5f5f5',
          }
        },
        placeholder: base => {
          return {
            ...base,
            margin: 0,
            color: '#f5f5f5',
          }
        },
        clearIndicator: base => {
          return {
            ...base,
            color: '#f5f5f5',
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
            padding: '.5rem 1rem',
          }
        },
      }}
    />
  )
}

export default CategorySelect
