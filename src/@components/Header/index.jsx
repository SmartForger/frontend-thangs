import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import { Carousel, Spacer, TitlePrimary, MultiLineBodyText } from '@components'
import { useCurrentUser } from '@hooks'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

import { ReactComponent as Caret } from '@svg/header-caret.svg'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'

import { ReactComponent as PromoGeoSearch } from '@svg/promo-geosearch.svg'
import { ReactComponent as PromoStorage } from '@svg/promo-storage.svg'
import { ReactComponent as PromoCollab } from '@svg/promo-collab.svg'
import { ReactComponent as PromoFree } from '@svg/promo-free.svg'

import UserNav from './UserNav'
import SearchBar from './SearchBar'
import LandingSearchBar from './LandingSearchBar'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, lg },
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
        margin: '1.5rem 2rem',
      },
    },
    Header_DesktopOnly: {
      display: 'none',

      [md]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    Header_DesktopWrapper: {
      transition: 'all 450ms',
      opacity: 1,
      height: ({ showNewHero, searchMinimized }) =>
        !showNewHero || searchMinimized ? '6rem' : '32.5rem',
    },
    Header_MobileOnly: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',

      [md]: {
        display: 'none',
      },
    },
    Header_MobileBoundary: {
      margin: '1.5rem 2rem',
      padding: 0,
      width: 'auto',
    },
    Header_LogoWrapper: {
      marginRight: '2.25rem',
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
    Header_SearchFormWrapper: {
      alignItems: 'center',
      display: 'flex',
      position: 'relative',
      width: '100%',
      margin: '0 1rem 1rem',
      background: theme.colors.purple[800],
      borderRadius: '.5rem',

      [md]: {
        margin: 0,
      },

      '& input': {
        background: theme.colors.purple[800],
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
        padding: '.5rem .75rem .5rem 2.25rem',
        lineHeight: '1.5rem',

        '&::placeholder': {
          fontSize: '.875rem',
          color: theme.colors.grey[500],
          fontWeight: 600,
        },
        '&:focus, &:active': {
          background: theme.colors.purple[800],
          color: theme.colors.white[400],
          '&::placeholder': {
            color: 'transparent',
          },
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow': `0 0 0px 1000px ${theme.colors.white[400]} inset`,
          '-webkit-text-fill-color': theme.colors.black[500],
          border: 'none',
        },
      },
    },
    Header_SearchForm: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      minWidth: '18.5rem',
      maxWidth: '32rem',

      [md]: {
        width: '60%',
      },
    },
    Header_SearchFormInput: {
      width: '100%',
      [md]: {
        width: '80%',
      },
    },
    Header_SearchFormInput_active: {
      color: theme.colors.white[400],
      '&::placeholder': {
        color: 'transparent',
      },
    },
    Header_SearchIcon: {
      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },
    },
    Header_SearchFormIcon: {
      position: 'absolute',
      left: '.75rem',
      '& path, & polygon': {
        fill: theme.colors.white[400],
      },
    },
    Header_DesktopSearchActionIcon: {
      position: 'absolute',
      right: '.75rem',
      cursor: 'pointer',
    },
    Header_UploadBar: {
      width: 18,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      color: theme.colors.gold[500],
      overflow: 'hidden',
      transition: 'width 1.4s',
      whiteSpace: 'nowrap',
      position: 'absolute',
      right: '2.75rem',
      cursor: 'pointer',

      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },

      '&:hover': {
        [lg]: {
          width: '9.5rem',
        },
      },
    },
    Header_UploadBar__expand: {
      [lg]: {
        width: '9.5rem',
      },
    },
    Header_UploadIcon: {
      display: 'flex',
      marginRight: '.5rem',
    },
    Header_Background: {
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    Header_Caret: {
      display: ({ notificationsIsOpen }) => (notificationsIsOpen ? 'block' : 'none'),
      position: 'absolute',
      bottom: '-1.5rem',
      right: '11rem',
    },
    Header_Landing: {
      color: theme.colors.white[400],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'spaceAround',
      transition: 'all 400ms',
      opacity: 1,
    },
    Header_LandingTitle: {
      color: theme.colors.white[400],
      transition: 'all 400ms',
    },
    Header_LandingBody: {
      color: theme.colors.white[400],
      textAlign: 'center',
      transition: 'all 400ms',
      opacity: 1,
      display: 'inline-block !important',

      '& span': {
        color: theme.colors.gold[500],
      },
    },
    Header_Carousel: {
      transition: 'all 400ms',
      opacity: 1,
    },
    Fade: {
      opacity: 0,
    },
  }
})

const noop = () => null

const PromoCards = [
  {
    IconComponent: PromoGeoSearch,
    title: 'Geometric Search',
    text: 'Upload your model to find geometrically similar models.',
  },
  {
    IconComponent: PromoStorage,
    title: 'Unlimited Storage',
    text: 'Upload as many models as your heart desires.',
  },
  {
    IconComponent: PromoCollab,
    title: 'Collaboration',
    text: 'Invite your friends and work together on projects.',
  },
  {
    IconComponent: PromoFree,
    title: 'And... its totally free',
    text: 'Who doesnt love free Thangs?',
  },
]

const Header = ({
  onNotificationsClick = noop,
  notificationsIsOpen,
  showSearchTextFlash,
  showUser = true,
  showNewHero = false,
}) => {
  const { dispatch, notifications } = useStoreon('notifications')
  const [searchMinimized, setMinimizeSearch] = useState(!showNewHero)
  const c = useStyles({ notificationsIsOpen, searchMinimized, showNewHero })
  const {
    atom: { isLoading, data: user },
  } = useCurrentUser()

  useEffect(() => {
    if (user && user.id) dispatch(types.FETCH_NOTIFICATIONS)
  }, [dispatch, user])

  const handleNotificationsClick = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
    if (!notificationsIsOpen) dispatch(types.READ_NOTIFICATIONS)
    onNotificationsClick()
  }, [dispatch, notificationsIsOpen, onNotificationsClick])

  return (
    <>
      <div className={c.Header}>
        <div className={c.Header_MobileOnly}>
          <div className={c.Header_MobileBoundary}>
            <div className={classnames(c.Header_Row, c.Header_TopRow)}>
              <Link to='/'>
                <Logo className={c.Header_Logo} />
              </Link>
              <UserNav
                c={c}
                handleNotificationsClick={handleNotificationsClick}
                notifications={notifications}
                notificationsIsOpen={notificationsIsOpen}
                dispatch={dispatch}
                isLoading={isLoading}
                user={user}
                showUser={showUser}
              />
            </div>
          </div>
          <SearchBar />
        </div>
        <div className={classnames(c.Header_DesktopOnly, c.Header_DesktopWrapper)}>
          <div className={c.Header_DesktopBoundary}>
            <div className={classnames(c.Header_Row, c.Header_TopRow)}>
              <div className={c.Header_RowWrapper}>
                <div className={c.Header_Row}>
                  <div
                    onClick={useCallback(() => dispatch(types.CLOSE_OVERLAY), [dispatch])}
                  >
                    <Link className={c.Header_LogoWrapper} to='/'>
                      <Logo className={c.Header_Logo} />
                      <LogoText />
                    </Link>
                  </div>
                  {searchMinimized && <SearchBar />}
                </div>
              </div>
              <UserNav
                c={c}
                handleNotificationsClick={handleNotificationsClick}
                notifications={notifications}
                notificationsIsOpen={notificationsIsOpen}
                dispatch={dispatch}
                isLoading={isLoading}
                user={user}
                showUser={showUser}
              />
            </div>
            <Caret className={c.Header_Caret} />
            {showNewHero && (
              <>
                <div
                  className={classnames(c.Header_Landing, {
                    [c.Fade]: searchMinimized,
                  })}
                >
                  <Spacer size={'1rem'} />
                  <TitlePrimary
                    light
                    className={classnames(c.Header_LandingTitle, {
                      [c.Fade]: searchMinimized,
                    })}
                  >
                    Let&apos;s find Thangs.
                  </TitlePrimary>
                  <Spacer size={'1rem'} />
                  <MultiLineBodyText
                    light
                    className={classnames(c.Header_LandingBody, {
                      [c.Fade]: searchMinimized,
                    })}
                  >
                    <span>Search</span>, <span>collaborate</span>, and <span>share </span>{' '}
                    your 3d models in one of
                    <br />
                    the fastest growing free communities.
                  </MultiLineBodyText>
                  <Spacer size={'2rem'} />
                  <LandingSearchBar
                    showSearchTextFlash={showSearchTextFlash}
                    searchMinimized={searchMinimized}
                    setMinimizeSearch={setMinimizeSearch}
                  />
                  <Spacer size={'2.5rem'} />
                </div>
                <Carousel
                  cards={PromoCards}
                  className={classnames(c.Header_Carousel, {
                    [c.Fade]: searchMinimized,
                  })}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
