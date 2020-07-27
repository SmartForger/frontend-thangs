import React, { useState, useCallback } from 'react'
import { useFlashNotification } from '@components/Flash'
import { useParams, useHistory, Link } from 'react-router-dom'
import { ProfilePicture } from '@components/ProfilePicture'
import { useCurrentUser } from '@customHooks/Users'
import { useUnreadNotificationCount } from '@customHooks/Notifications'
import { DropdownMenu, DropdownItem } from '@components/DropdownMenu'
import FolderCreateModal from '@components/FolderCreateModal'
import { Button } from '@components/Button'
import { authenticationService } from '@services'
import classnames from 'classnames'
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
    Footer_Row: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'baseline',

      '&:not(:last-of-type)': {
        marginBottom: '1.5rem',
      },
    },
    Footer_TopRow: {
      paddingTop: '3.5rem',
      borderTop: `1px solid ${theme.colors.purple[300]}`,
    },
    Footer_Summary: {
      ...theme.mixins.text.footerText,
      maxWidth: '19.5rem',
      marginRight: '6rem',
    },
    Footer_LinkContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    Footer_Link: {
      color: theme.colors.purple[400],
      lineHeight: '1.5rem',
    },
    Footer_SocialLink: {
      display: 'inline-block',
      marginRight: '1.5rem',
    },
    Footer_Copyright: {
      ...theme.mixins.text.footerText,
    },
  }
})

const Footer = ({ inverted }) => {
  const c = useStyles({ inverted })
  return (
    <>
      <div className={c.Footer}>
        <div className={classnames(c.Footer_Row, c.Footer_TopRow)}>
          <Link to='/'>
            <Logo className={c.Footer_Logo} />
            <LogoText />
          </Link>
        </div>
        <div className={c.Footer_Row}>
          <div className={c.Footer_Summary}>
            Thangs is the world&apos;s largest 3D model community for 3D enthusiasts and
            engineers. Find 3D models, share and collaborate with Thangs users around the
            world.
          </div>
          <div className={c.Footer_LinkContainer}>
            <Link className={c.Footer_Link} to='/about'>
              About
            </Link>
            <Link className={c.Footer_Link} to='/help'>
              Help
            </Link>
            <Link className={c.Footer_Link} to='/careers'>
              Careers
            </Link>
          </div>
        </div>
        <div className={c.Footer_Row}>
          <div className={c.Footer_SocialBar}>
            <Link to='www.facebook.com' className={c.Footer_SocialLink}>
              <FacebookIcon />
            </Link>
            <Link to='www.twitter.com' className={c.Footer_SocialLink}>
              <TwitterIcon />
            </Link>
            <Link to='www.instagram.com' className={c.Footer_SocialLink}>
              <InstagramIcon />
            </Link>
          </div>
        </div>
        <div className={c.Footer_Row}>
          <div className={c.Footer_Copyright}>
            ©Copyright 2020 Thangs All rights reserved.
          </div>
        </div>
      </div>
    </>
  )
}

export { Footer }
