import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Banner: {},
    Banner_TopRowText: {
      fontWeight: '600',
      lineHeight: '1.5rem',
      textAlign: 'center',
      color: theme.colors.black[500],
      padding: '.25rem 0',
    },
  }
})

const Banner = props => {
  const c = useStyles()

  return (
    <div>
      <div className={c.Banner_TopRowText}>{props.children}</div>
    </div>
  )
}

export default Banner
