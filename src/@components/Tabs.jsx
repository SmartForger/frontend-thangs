import React from 'react'
import classnames from 'classnames'
import { Button } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    TabsWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      [md]: {
        justifyContent: 'flex-end',
        width: 'auto',
      },
    },
    Tabs: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '.25rem',
      backgroundColor: theme.colors.white[400],
      borderRadius: '.5rem',
    },
    Tabs_Button: {
      color: theme.colors.black[500],
    },
  }
})
const noop = () => null
const Tabs = ({ className, options = [] }) => {
  const c = useStyles({})
  return (
    <div className={classnames(className, c.TabsWrapper)}>
      <div className={c.Tabs}>
        {options.map((option, ind) => {
          const { label, selected, onClick = noop } = option
          return (
            <div key={`Tab_${ind}`}>
              <Button className={c.Tabs_Button} tertiary={!selected} onClick={onClick}>
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
