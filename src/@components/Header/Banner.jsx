import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(() => {
  return {
    Banner: {},
    Banner_TopRow: {
      height: '2.5rem',
      background: '#FFBC00',
    },
    Banner_TopRowText: {
      fontFamily: 'Proxima Nova',
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
