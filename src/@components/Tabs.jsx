import React from 'react'
import classnames from 'classnames'
import { Button } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Tabs_Wrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      [md]: {
        justifyContent: 'flex-end',
        width: 'auto',
      },
    },
    Tabs: {
      backgroundColor: theme.colors.white[400],
      borderRadius: '1.5rem',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '.25rem',
    },
    Tabs_Button: {
      borderRadius: '1.5rem',
      color: theme.colors.black[500],
      padding: '.5rem 1rem',
    },
  }
})
const noop = () => null
const Tabs = ({
  className,
  options = [],
  disabled = false,
  onChange = noop,
  selectedValue,
}) => {
  const c = useStyles({})
  return (
    <div className={classnames(className, c.Tabs_Wrapper)}>
      <div className={c.Tabs}>
        {options.map((option, ind) => {
          const { label, value } = option
          const handleChange = () => {
            onChange(value)
          }
          const selected = selectedValue.value === value
          return (
            <div key={`Tab_${ind}`}>
              <Button
                className={c.Tabs_Button}
                tertiary={!selected}
                onClick={disabled ? noop : handleChange}
              >
                {label}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Tabs
