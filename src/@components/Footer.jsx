import React from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as FacebookIcon } from '@svg/social-facebook.svg'
import { ReactComponent as InstagramIcon } from '@svg/social-instagram.svg'
import { ReactComponent as TwitterIcon } from '@svg/social-twitter.svg'
import { ReactComponent as PinterestIcon } from '@svg/share-pinterest.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Footer: {
      padding: '1rem 4rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'center',

      [md]: {
        flexDirection: 'row',
      },

      '& > p': {
        margin: 0,
        fontWeight: '500',
        whiteSpace: 'nowrap',

        [md]: {
          width: '6.5rem',
        },
      },

      '& > a': {
        color: theme.variables.colors.mainFontColor,
        width: '6.5rem',
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
      <p>Thangs® 2021 by Physna Inc</p>
      <div>
        <ul className={c.Footer_Social}>
          <li>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.facebook.com/Thangs3D'
            >
              <FacebookIcon />
            </a>
          </li>
          <li>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.instagram.com/Thangs3D'
            >
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://twitter.com/Thangs3D'
            >
              <TwitterIcon />
            </a>
          </li>
          <li>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.pinterest.com/Thangs3D/_created/'
            >
              <PinterestIcon />
            </a>
          </li>
        </ul>
      </div>
      <Link to={'/privacy-policy'}>Privacy Policy</Link>
    </div>
  )
}

export default Footer
