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
      margin: '2rem 3rem 0',
      padding: '2rem 1rem',

      '& > p': {
        margin: 0,
      },

      '& > a': {
        color: theme.colors.black[500],
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
