import React from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Footer: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '3.75rem',

      '& > p': {
        margin: 0,
        paddingLeft: '4rem',
      },

      '& > a': {
        color: theme.colors.black[500],
        paddingRight: '4rem',
      },
    },
  }
})

const Footer = () => {
  const c = useStyles()
  return (
    <div className={c.Footer}>
      <p>Thangs® 2020 by Physna Inc</p>
      <Link to={'/privacy_policy'}>Privacy Policy</Link>
    </div>
  )
}

export default Footer
