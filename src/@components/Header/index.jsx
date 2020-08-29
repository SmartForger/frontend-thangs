import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import { useCurrentUser } from '@hooks'
import { createUseStyles } from '@style'

import { ReactComponent as BackgroundSvg } from '@svg/header-background.svg'
import { ReactComponent as Caret } from '@svg/header-caret.svg'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'

import UserNav from './UserNav'
import SearchBar from './SearchBar'

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
          '-webkit-box-shadow': `0 0 0px 1000px ${theme.colors.purple[800]} inset`,
          '-webkit-text-fill-color': theme.colors.white[400],
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
  }
})

const noop = () => null

const Header = ({
  inverted,
  onNotificationsClick = noop,
  notificationsIsOpen,
  showSearchTextFlash,
  showSearch = true,
  showUser = true,
}) => {
  const { dispatch } = useStoreon()
  const c = useStyles({ inverted, notificationsIsOpen })
  const [showMobileSearch, setShowMobileSearch] = useState(showSearch)

  const {
    atom: { isLoading, data: user },
  } = useCurrentUser()
  const handleNotificationsClick = useCallback(() => {
    dispatch('close-modal')
    if (!notificationsIsOpen) dispatch('read-notifications')
    onNotificationsClick()
  }, [dispatch, notificationsIsOpen, onNotificationsClick])

  const handleSearchClicked = useCallback(() => {
    setShowMobileSearch(!showMobileSearch)
  }, [showMobileSearch])

  return (
    <>
      <div className={c.Header}>
        <BackgroundSvg className={c.Header_Background} />
        <span className={c.Header_MobileOnly}>
          <div className={c.Header_MobileBoundary}>
            <div className={classnames(c.Header_Row, c.Header_TopRow)}>
              <Link to='/'>
                <Logo className={c.Header_Logo} />
              </Link>
              <UserNav
                c={c}
                handleNotificationsClick={handleNotificationsClick}
                notificationsIsOpen={notificationsIsOpen}
                dispatch={dispatch}
                handleSearchShow={handleSearchClicked}
                isLoading={isLoading}
                user={user}
                showUser={showUser}
              />
            </div>
          </div>
          {showMobileSearch && showSearch && (
            <div>
              <SearchBar isMobile />
            </div>
          )}
        </span>
        <span className={c.Header_DesktopOnly}>
          <div className={c.Header_DesktopBoundary}>
            <div className={classnames(c.Header_Row, c.Header_TopRow)}>
              <div className={c.Header_RowWrapper}>
                <div className={c.Header_Row}>
                  <div onClick={useCallback(() => dispatch('close-modal'), [dispatch])}>
                    <Link className={c.Header_LogoWrapper} to='/'>
                      <Logo className={c.Header_Logo} />
                      <LogoText />
                    </Link>
                  </div>
                  {showSearch && <SearchBar showSearchTextFlash={showSearchTextFlash} />}
                </div>
              </div>
              <UserNav
                c={c}
                handleNotificationsClick={handleNotificationsClick}
                notificationsIsOpen={notificationsIsOpen}
                dispatch={dispatch}
                isLoading={isLoading}
                user={user}
                showUser={showUser}
              />
            </div>
            <Caret className={c.Header_Caret} />
          </div>
        </span>
      </div>
    </>
  )
}

export default Header
