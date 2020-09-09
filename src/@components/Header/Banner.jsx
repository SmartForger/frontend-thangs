import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Banner: {},
    Banner_TopRow: {
      background: theme.colors.gold[500],
    },
    Banner_TopRowText: {
      fontWeight: 600,
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
    <div className={c.Banner_TopRow}>
      <div className={c.Banner_TopRowText}>{props.children}</div>
    </div>
  )
}

export default Banner
