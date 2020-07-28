import React from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'

import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'
import { ReactComponent as FacebookIcon } from '@svg/social-facebook.svg'
import { ReactComponent as TwitterIcon } from '@svg/social-twitter.svg'
import { ReactComponent as InstagramIcon } from '@svg/social-instagram.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Footer: {
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2.5rem',
      paddingRight: '1rem',
      paddingBottom: '2rem',
      paddingLeft: '1rem',

      [md]: {
        paddingRight: '6.25rem',
        paddingLeft: '6.25rem',
      },
    },
    Footer_Container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: '3rem',
      borderTop: `1px solid ${theme.colors.grey[300]}`,
    },
    Footer_DesktopBoundary: {
      position: 'relative',
      margin: '3rem auto 1rem',
      maxWidth: theme.variables.maxWidth,
      flexGrow: 1,

      [md]: {
        margin: '3rem 6.25rem 1rem',
      },
    },
    Footer_DesktopOnly: {
      display: 'none',

      [md]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    Footer_MobileOnly: {
      [md]: {
        display: 'none',
      },
    },
    Footer_MobileBoundary: {
      margin: '2.75rem 0 auto',
      padding: '0 .75rem',
    },
    Footer_Logo: {
      marginRight: '.75rem',
      '& path': {
        fill: theme.colors.logo,
      },
    },
    Footer_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    Footer_Summary: {
      ...theme.mixins.text.footerText,
      maxWidth: '19.5rem',
      marginTop: '1.5rem',
    },
    Footer_SiteLinkContainer: {
      display: 'none', //'flex' TEMP OFF
      flexDirection: 'column',
    },
    Footer_SiteLink: {
      color: theme.colors.purple[400],
      lineHeight: '1.5rem',
    },
    Footer_SocialLinkContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '1.5rem',
    },
    Footer_SocialLink: {
      marginLeft: '1.5rem',
    },
    Footer_Copyright: {
      ...theme.mixins.text.footerText,
    },
  }
})

const Footer = ({ inverted }) => {
  const c = useStyles({ inverted })
  return (
    <div className={c.Footer}>
      <div className={c.Footer_Container}>
        <div className={c.Footer_Column}>
          <Link to='/'>
            <Logo className={c.Footer_Logo} />
            <LogoText />
          </Link>
          <div className={c.Footer_Summary}>
            Thangs is the world&apos;s largest 3D model community for 3D enthusiasts and
            engineers. Find 3D models, share and collaborate with Thangs users around the
            world.
          </div>
          <div className={c.Footer_SiteLinkContainer}>
            <Link className={c.Footer_SiteLink} to='/about'>
              About
            </Link>
            <Link className={c.Footer_SiteLink} to='/help'>
              Help
            </Link>
            <Link className={c.Footer_SiteLink} to='/careers'>
              Careers
            </Link>
          </div>
        </div>
        <div className={c.Footer_Column}>
          <div className={c.Footer_SocialLinkContainer}>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.facebook.com/physna/'
              className={c.Footer_SocialLink}
            >
              <FacebookIcon />
            </a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://twitter.com/Physna3D'
              className={c.Footer_SocialLink}
            >
              <TwitterIcon />
            </a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.instagram.com/physna3d/'
              className={c.Footer_SocialLink}
            >
              <InstagramIcon />
            </a>
          </div>
          <div className={c.Footer_Copyright}>
            ©Copyright 2020 Thangs All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export { Footer }
