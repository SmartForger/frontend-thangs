import React from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'
import { ReactComponent as FacebookIcon } from '@svg/social-facebook.svg'
import { ReactComponent as InstagramIcon } from '@svg/social-instagram.svg'
import { ReactComponent as TwitterIcon } from '@svg/social-twitter.svg'

const useStyles = createUseStyles(theme => {
  return {
    Footer: {
      padding: '1rem 4rem',
      display: 'flex',
      justifyContent: 'space-between',

      '& > p': {
        margin: 0,
        fontWeight: 500,
      },

      '& > a': {
        color: theme.variables.colors.mainFontColor,
      },
    },
    Footer_Social: {
      display: 'flex',

      '& li': {
        padding: '0 1rem',
      },
    },
  }
})

const Footer = () => {
  const c = useStyles()
  return (
    <div className={c.Footer}>
      <p>Thangs® 2020 by Physna Inc</p>
      <div>
        <ul className={c.Footer_Social}>
          <li>
            <a href='https://www.facebook.com/Thangs3D'>
              <FacebookIcon />
            </a>
          </li>
          <li>
            <a href='https://www.instagram.com/Thangs3D'>
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a href='https://twitter.com/Thangs3D'>
              <TwitterIcon />
            </a>
          </li>
        </ul>
      </div>
      <Link to={'/privacy-policy'}>Privacy Policy</Link>
    </div>
  )
}

export default Footer
