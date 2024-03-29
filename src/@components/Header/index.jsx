import React, { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import { AboutHero, LandingHero, UserNav } from '@components'
import { useCurrentUser } from '@hooks'
import { useOverlay } from '@contexts/Overlay'
import { createUseStyles, useTheme } from '@physna/voxel-ui/@style'
import * as types from '@constants/storeEventTypes'

import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'

import SearchBar from './SearchBar'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Header: {
      padding: 0,
      position: 'relative',
      justifyContent: 'center',
      borderTop: `.125rem solid ${theme.colors.gold[500]}`,
      background: theme.colors.purple[900],
    },
    Header_DesktopBoundary: {
      position: 'relative',
      maxWidth: theme.variables.maxWidth,
      flexGrow: 1,

      [md]: {
        margin: '1.125rem 1rem',
      },
    },
    Header_DesktopOnly: {
      display: 'flex',
      justifyContent: 'center',
    },
    Header_DesktopOnly_Curtain: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'none',
      zIndex: '0',
    },
    Header_DesktopWrapper: {
      transition: 'all 450ms',
      opacity: '1',
    },
    Header_MobileOnly: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    Header_MobileBoundary: {
      margin: '1.5rem 2rem',
      padding: 0,
      width: 'auto',
    },
    Header_LogoWrapper: {
      display: 'flex',
      flexWrap: 'nowrap',
    },
    Header_RowWrapper: {
      width: '100%',
    },
    Header_Row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      '&:not(:last-of-type)': {
        marginBottom: '1.5rem',
      },

      [md]: {
        justifyContent: 'flex-start',
      },
    },
    Header_TopRow: {
      height: '3rem',
    },
  }
})

const Header = ({
  showSearchTextFlash,
  showUser = true,
  showNewHero = false,
  showAboutHero = false,
}) => {
  const { dispatch } = useStoreon()
  const { setOverlayOpen } = useOverlay()
  const c = useStyles({ showNewHero })
  const { md } = useTheme().breakpoints
  const {
    atom: { isLoading, data: user },
  } = useCurrentUser()

  const handleClick = useCallback(() => {
    if (setOverlayOpen) {
      setOverlayOpen(false)
    }
  }, [setOverlayOpen])

  useEffect(() => {
    dispatch(types.FETCH_MODELS_STATS)
  }, [dispatch])

  useEffect(() => {
    if (user && user.id) dispatch(types.FETCH_NOTIFICATIONS)
  }, [dispatch, user])

  return (
    <>
      <div className={c.Header}>
        {md ? (
          <div className={classnames(c.Header_DesktopOnly, c.Header_DesktopWrapper)}>
            <div className={c.Header_DesktopBoundary}>
              <div className={classnames(c.Header_Row, c.Header_TopRow)}>
                <div className={c.Header_RowWrapper}>
                  <div className={c.Header_Row}>
                    <div onClick={handleClick}>
                      <Link className={c.Header_LogoWrapper} to='/'>
                        <Logo className={c.Header_Logo} />
                        <LogoText />
                      </Link>
                    </div>
                    {!showNewHero && <SearchBar />}
                  </div>
                </div>
                <UserNav c={c} isLoading={isLoading} user={user} showUser={showUser} />
              </div>
              {showNewHero && (
                <LandingHero showSearchTextFlash={showSearchTextFlash} user={user} />
              )}
              {showAboutHero && <AboutHero user={user} />}
            </div>
            <div
              id='HeaderDesktopOnlyCurtain'
              className={classnames(c.Header_DesktopOnly_Curtain)}
            ></div>
          </div>
        ) : (
          <div className={c.Header_MobileOnly}>
            <div className={c.Header_MobileBoundary}>
              <div className={classnames(c.Header_Row, c.Header_TopRow)}>
                <Link to='/'>
                  <Logo className={c.Header_Logo} />
                </Link>
                <UserNav c={c} isLoading={isLoading} user={user} showUser={showUser} />
              </div>
            </div>
            <SearchBar />
          </div>
        )}
      </div>
    </>
  )
}

export default Header
