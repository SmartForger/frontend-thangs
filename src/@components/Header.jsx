import React, { useCallback, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import {
  Button,
  ProfilePicture,
  TextInput,
  DropdownMenu,
  DropdownItem,
  useFlashNotification,
} from '@components'
import { useCurrentUser, useNotifications } from '@hooks'
import { authenticationService } from '@services'
import { createUseStyles } from '@style'

import { ReactComponent as BackgroundSvg } from '@svg/header-background.svg'
import { ReactComponent as Caret } from '@svg/header-caret.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon-gray.svg'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'
import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass-header.svg'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg'
import { ReactComponent as UserIcon } from '@svg/icon_user.svg'

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
      [md]: {
        display: 'none',
      },
    },
    Header_MobileBoundary: {
      margin: '1rem 0 auto',
      padding: '0 .75rem',
    },
    Header_LogoWrapper: {
      marginRight: '2.25rem',
    },
    Header_Row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      '&:not(:last-of-type)': {
        marginBottom: '1.5rem',
      },
    },
    Header_TopRow: {
      height: '3rem',
    },
    Header_Button: {
      marginLeft: '1rem',
    },
    Header_ClickableButton: {
      cursor: 'pointer',
    },
    Header_ButtonsRow: {
      '& > a': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:last-child': {
          marginRight: 0,
        },
      },
    },
    Header_NotificationIconWrapper: {
      position: 'relative',
    },
    Header_NotificationIcon: {
      color: theme.colors.purple[400],
      '& path': {
        stroke: ({ notificationsIsOpen }) =>
          notificationsIsOpen ? theme.colors.gold[500] : theme.colors.purple[500],
      },
    },
    Header_UnreadBadge: {
      background: theme.colors.gold[500],
      borderRadius: '100%',
      color: theme.colors.purple[900],
      width: '.875rem',
      height: '.875rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '.5625rem',
      fontWeight: 'bold',
      position: 'absolute',
      top: '-.5rem',
      right: '.7rem',
    },
    Header_DropdownMenu: {
      margin: 'auto',
      marginLeft: '1rem',
      zIndex: 5,
    },
    Header_AddModelDropdown: {
      margin: '0 1rem',
      width: '3rem',
      lineHeight: 0,
      '> div': {
        right: 0,
      },
    },
    Header_TextButton: {
      marginRight: '1.5rem',
      fontSize: '1rem',
      lineHeight: '1rem',
      fontWeight: 'bold',
      color: theme.colors.white[400],

      '& span': {
        marginLeft: '.5rem',
      },
    },
    Header_SignUpButton: {
      marginRight: '.5rem',
      color: theme.colors.gold[500],
    },
    Header_SearchFormWrapper: {
      alignItems: 'center',
      display: 'flex',
      position: 'relative',

      '& input': {
        background: theme.colors.purple[800],
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
        padding: '.5rem .75rem .5rem 2.25rem',
        lineHeight: '1.5rem',
        width: '20rem',

        '&::placeholder': {
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
    },
    Header_SearchFormIcon: {
      position: 'absolute',
      left: '.75rem',
      '& path, & polygon': {
        fill: theme.colors.grey[500],
      },
    },
    Header_SearchFormInput_active: {
      color: theme.colors.white[400],
      '&::placeholder': {
        color: 'transparent',
      },
    },
    Header_SearchIcon: {
      position: 'absolute',
      right: '.75rem',
    },
    Header_UploadIcon: {
      position: 'absolute',
      right: '2.75rem',

      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },
    },
    Header_SearchButton: {
      marginLeft: '.5rem',
    },
    Header_UserPicture: {
      marginLeft: '1rem',
    },
    Header_Background: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    Header_Caret: {
      display: ({ notificationsIsOpen }) => (notificationsIsOpen ? 'block' : 'none'),
      position: 'absolute',
      bottom: '-1.5rem',
      right: '11rem',
    },
  }
})

const NotificationsButton = ({ c, handleNotificationsClick }) => {
  const { useUnreadNotificationCount } = useNotifications()
  const { unreadNotificationCount } = useUnreadNotificationCount()
  return (
    <div
      className={classnames(c.Header_NotificationIconWrapper, c.Header_ClickableButton)}
      onClick={handleNotificationsClick}
    >
      <NotificationIcon className={c.Header_NotificationIcon} />
      {unreadNotificationCount > 0 && (
        <div className={c.Header_UnreadBadge}>{unreadNotificationCount}</div>
      )}
    </div>
  )
}

const ProfileDropdownMenu = ({ c, dispatch, user, TargetComponent }) => {
  const history = useHistory()
  const { navigateWithFlash } = useFlashNotification()
  const handleAfterCreate = useCallback(
    folder => {
      dispatch('close-modal')
      navigateWithFlash(
        `/folder/${folder.folderId}`,
        'Folder created successfully. If the provided email addresses belong to registered Thangs users, they will have access to your folder.'
      )
    },
    [dispatch, navigateWithFlash]
  )

  return (
    <DropdownMenu
      className={c.Header_DropdownMenu}
      TargetComponent={TargetComponent}
      user={user}
    >
      <DropdownItem to='/home'>
        <UserIcon /> View Profile
      </DropdownItem>
      <DropdownItem to='/profile/likes'>
        <HeartIcon /> Liked Models
      </DropdownItem>
      <DropdownItem
        onClick={() => {
          dispatch('open-modal', {
            modalName: 'createFolder',
            modalData: {
              afterCreate: handleAfterCreate,
            },
          })
        }}
      >
        <NewFolderIcon /> Add Folder
      </DropdownItem>
      <DropdownItem
        onClick={() => {
          dispatch('close-modal')
          authenticationService.logout()
          history.push('/')
        }}
      >
        <ExitIcon />
        Sign Out
      </DropdownItem>
    </DropdownMenu>
  )
}

const ProfileDropdown = ({ user, onClick = noop }) => {
  const c = useStyles({ inverted: false, notificationsIsOpen: false })

  return (
    <div
      className={c.Header_ClickableButton}
      onClick={() => {
        onClick()
      }}
    >
      <ProfilePicture
        name={user.fullName}
        src={user && user.profile && user.profile.avatarUrl}
        size='2.375rem'
      />
    </div>
  )
}

const UserNav = ({ c, handleNotificationsClick, dispatch }) => {
  const { loading, user } = useCurrentUser()

  if (loading) {
    return <div className={c.Header_Row}></div>
  }

  if (user) {
    return (
      <div className={classnames(c.Header_Row, c.Header_ButtonsRow)}>
        <NotificationsButton c={c} handleNotificationsClick={handleNotificationsClick} />
        <ProfileDropdownMenu
          c={c}
          user={user}
          TargetComponent={ProfileDropdown}
          dispatch={dispatch}
        />
        <Button
          className={c.Header_Button}
          onClick={() => dispatch('open-modal', { modalName: 'upload' })}
        >
          Upload
        </Button>
      </div>
    )
  }

  return (
    <div className={classnames(c.Header_Row, c.Header_ButtonsRow)}>
      <Link to={'/signup/alpha'}>
        <Button text className={classnames(c.Header_TextButton, c.Header_SignUpButton)}>
          Sign up
        </Button>
      </Link>
      <Button
        className={c.Header_Button}
        onClick={() =>
          dispatch('open-modal', {
            modalName: 'signIn',
            modalData: { afterSignIn: () => dispatch('close-modal') },
          })
        }
      >
        Sign in
      </Button>
    </div>
  )
}
const noop = () => null
const Header = ({
  inverted,
  variant,
  handleNotificationsClick = noop,
  notificationsIsOpen,
}) => {
  const { dispatch } = useStoreon()
  const history = useHistory()
  const c = useStyles({ inverted, notificationsIsOpen })
  const [searchTerm, setSearchTerm] = useState(undefined)

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (searchTerm) {
      dispatch('get-search-results-by-text', {
        searchTerm: searchTerm,
        onFinish: _results => {
          history.push(`/search/${searchTerm}`)
          dispatch('close-modal')
        },
        onError: error => {
          // eslint-disable-next-line no-console
          console.log('e:', error)
        },
      })
    }
  }

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
              {variant !== 'logo-only' && (
                <UserNav
                  c={c}
                  handleNotificationsClick={handleNotificationsClick}
                  dispatch={dispatch}
                />
              )}
            </div>
          </div>
        </span>
        <span className={c.Header_DesktopOnly}>
          <div className={c.Header_DesktopBoundary}>
            <div className={classnames(c.Header_Row, c.Header_TopRow)}>
              <div>
                <div className={c.Header_Row}>
                  <Link className={c.Header_LogoWrapper} to='/'>
                    <Logo className={c.Header_Logo} />
                    <LogoText />
                  </Link>
                  {variant !== 'logo-only' && (
                    <>
                      <form className={c.Header_SearchForm} onSubmit={handleSearchSubmit}>
                        <div className={classnames(c.Header_SearchFormWrapper)}>
                          <MagnifyingGlass className={c.Header_SearchFormIcon} />
                          <TextInput
                            name='search'
                            placeholder='Search'
                            className={classnames(c.Header_SearchFormInput, {
                              [c.Header_SearchFormInput_active]: searchTerm,
                            })}
                            onChange={e => {
                              setSearchTerm(e.target.value)
                            }}
                            value={searchTerm || ''}
                          />
                          <UploadIcon
                            className={classnames(c.Header_UploadIcon)}
                            onClick={() =>
                              dispatch('open-modal', { modalName: 'searchByUpload' })
                            }
                          />
                          <MagnifyingGlass
                            className={classnames(c.Header_SearchIcon)}
                            onClick={handleSearchSubmit}
                          />
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
              {variant !== 'logo-only' && (
                <UserNav
                  c={c}
                  handleNotificationsClick={handleNotificationsClick}
                  dispatch={dispatch}
                />
              )}
            </div>
            <Caret className={c.Header_Caret} />
          </div>
        </span>
      </div>
    </>
  )
}

export default Header
