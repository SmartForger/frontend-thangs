import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Banner: {},
    Banner_TopRow: {
      height: '2.5rem',
      background: theme.colors.gold[500],
    },
    Banner_TopRowText: {
      fontFamily: theme.variables.fonts.mainFont,
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '.875rem',
      lineHeight: '2.625rem',
      alignItems: 'center',
      textAlign: 'center',
      color: '#333333',
      flex: 'none',
      alignSelf: 'center',
      margin: 'auto',
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
