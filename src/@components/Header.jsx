import React, { useState, useCallback } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import {
  Button,
  ProfilePicture,
  TextInput,
  useFlashNotification,
  DropdownMenu,
  DropdownItem,
  CreateFolderModal,
  CreateTeamModal,
} from '@components'
import { useCurrentUser, useNotifications } from '@hooks'
import { authenticationService } from '@services'
import classnames from 'classnames'
import { createUseStyles } from '@style'

import { ReactComponent as BackgroundSvg } from '@svg/header-background.svg'
import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'
import { ReactComponent as PlusButton } from '@svg/icon-blue-circle-plus.svg'
import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass-header.svg'
import { ReactComponent as UploadModelToFolderIcon } from '@svg/upload-model-to-folder-icon.svg'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon-gray.svg'
import { ReactComponent as PencilIcon } from '@svg/icon-pencil.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as MatchingIcon } from '@svg/matching-icon-header.svg'
import { ReactComponent as ClearIcon } from '@svg/icon-input-clear.svg'
import { ReactComponent as Caret } from '@svg/header-caret.svg'

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
      height: '3rem',
      margin: 'auto',
      '& > button': {
        height: '3rem',
      },
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
    Header_SearchFormWrapper: {
      alignItems: 'center',
      display: 'flex',
      position: 'relative',

      '& input': {
        paddingLeft: '2rem',

        outline: 'none',
        fontSize: '1rem',
        lineHeight: '1rem',
        '&::placeholder': {
          color: theme.colors.white[400],
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
    Header_SearchFormIcon: {
      position: 'absolute',
      left: '.75rem',
    },
    Header_SearchFormInput: {
      backgroundColor: 'transparent',
    },
    Header_SearchFormInput_active: {
      background: theme.colors.purple[800],
      color: theme.colors.white[400],
      '&::placeholder': {
        color: 'transparent',
      },
    },
    Header_SearchClearIcon: {
      display: 'none',
      position: 'absolute',
      right: '.75rem',
    },
    Header_SearchClearIcon_active: {
      display: 'block',
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
      right: '17.75rem',
    },
  }
})

const NotificationsButton = ({ c, handleNotificationsClick }) => {
  const { useUnreadNotificationCount } = useNotifications()
  const { unreadNotificationCount } = useUnreadNotificationCount()
  return (
    <div className={c.Header_NotificationIconWrapper} onClick={handleNotificationsClick}>
      <NotificationIcon className={c.Header_NotificationIcon} />
      {unreadNotificationCount > 0 && (
        <div className={c.Header_UnreadBadge}>{unreadNotificationCount}</div>
      )}
    </div>
  )
}

const UserPicture = ({ user, className }) => {
  return (
    <Link className={className} to='/home/'>
      <ProfilePicture
        name={user.fullName}
        src={user && user.profile && user.profile.avatarUrl}
        size='2.375rem'
      />
    </Link>
  )
}

const AddModelDropdownMenu = ({ c }) => {
  const { folderId } = useParams()
  const [createFolderIsOpen, setCreateFolderIsOpen] = useState(false)
  const [createTeamIsOpen, setCreateTeamIsOpen] = useState(false)
  const [newFolderData, setNewFolderData] = useState({})
  const { navigateWithFlash } = useFlashNotification()
  const setFolderOpen = useCallback(() => {
    setCreateFolderIsOpen(true)
  }, [])
  const setTeamOpen = useCallback(() => {
    setCreateTeamIsOpen(true)
  }, [])
  const setFolderClose = useCallback(() => setCreateFolderIsOpen(false), [])
  const setTeamClose = useCallback(() => setCreateTeamIsOpen(false), [])

  return (
    <>
      <DropdownMenu
        className={classnames(c.Header_DropdownMenu, c.Header_AddModelDropdown)}
        buttonIcon={PlusButton}
      >
        {folderId && (
          <DropdownItem to={`/folder/${folderId}/upload`}>
            <UploadModelToFolderIcon /> Upload model to folder
          </DropdownItem>
        )}
        <DropdownItem to='/upload'>
          <ModelSquareIcon /> Upload model
        </DropdownItem>
        <DropdownItem to='/' onClick={setFolderOpen}>
          <NewFolderIcon />
          Create Folder
        </DropdownItem>
      </DropdownMenu>
      {createFolderIsOpen && (
        <CreateFolderModal
          isOpen={createFolderIsOpen}
          onCancel={setFolderClose}
          onTeamModalOpen={newFolderData => {
            setNewFolderData(newFolderData)
            setFolderClose()
            setTeamOpen()
          }}
          afterCreate={folder => {
            setFolderClose()
            navigateWithFlash(
              `/folder/${folder.folderId}`,
              'Folder created successfully. If the provided email addresses belong to registered Thangs users, they will have access to your folder.'
            )
          }}
        />
      )}
      {createTeamIsOpen && (
        <CreateTeamModal
          isOpen={createTeamIsOpen}
          onCancel={() => {
            setTeamClose()
            setFolderOpen()
          }}
          afterCreate={folder => {
            setTeamClose()
            navigateWithFlash(
              `/folder/${folder.folderId}`,
              'Folder created successfully. If the provided email addresses belong to registered Thangs users, they will have access to your folder.'
            )
          }}
          newFolderData={newFolderData}
        />
      )}
    </>
  )
}

const ProfileDropdownMenu = ({ c }) => {
  const history = useHistory()

  return (
    <DropdownMenu className={c.Header_DropdownMenu}>
      <DropdownItem to='/profile/edit'>
        <PencilIcon /> Edit Profile
      </DropdownItem>
      <DropdownItem to='/profile/likes'>
        <HeartIcon /> Liked Models
      </DropdownItem>
      <DropdownItem
        onClick={() => {
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

const UserNav = ({ c, handleNotificationsClick, handleModalOpen }) => {
  const { loading, user } = useCurrentUser()

  if (loading) {
    return <div className={c.Header_Row}></div>
  }

  if (user) {
    return (
      <div className={classnames(c.Header_Row, c.Header_ButtonsRow)}>
        <NotificationsButton c={c} handleNotificationsClick={handleNotificationsClick} />
        <UserPicture className={c.Header_UserPicture} user={user} />
        <ProfileDropdownMenu c={c} />
        <AddModelDropdownMenu c={c} />
        <Button className={c.Header_Button} onClick={() => handleModalOpen('upload')}>
          Upload
        </Button>
      </div>
    )
  }

  return (
    <div className={classnames(c.Header_Row, c.Header_ButtonsRow)}>
      <Link to='/login'>
        <Button className={c.Header_Button}>Sign in</Button>
      </Link>
    </div>
  )
}
const noop = () => null
const Header = ({
  inverted,
  variant,
  handleNotificationsClick = noop,
  handleModalOpen = noop,
  notificationsIsOpen,
}) => {
  const c = useStyles({ inverted, notificationsIsOpen })
  const [searchTerm, setSearchTerm] = useState(undefined)

  const handleSearchSubmit = e => {
    e.preventDefault()
    console.log('Search...')
  }

  const handleSearchClear = () => {
    setSearchTerm(undefined)
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
                  handleModalOpen={handleModalOpen}
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
                  <Button
                    text
                    className={c.Header_TextButton}
                    onClick={() => console.log('show upload overlay')}
                  >
                    <MatchingIcon />
                    <span>Model upload search</span>
                  </Button>
                  <form onSubmit={handleSearchSubmit}>
                    <div className={classnames(c.Header_SearchFormWrapper)}>
                      <MagnifyingGlass
                        className={c.Header_SearchFormIcon}
                        onClick={handleSearchSubmit}
                      />
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
                      <ClearIcon
                        className={classnames(c.Header_SearchClearIcon, {
                          [c.Header_SearchClearIcon_active]: searchTerm,
                        })}
                        onClick={handleSearchClear}
                      />
                    </div>
                  </form>
                </div>
              </div>
              {variant !== 'logo-only' && (
                <UserNav
                  c={c}
                  handleNotificationsClick={handleNotificationsClick}
                  handleModalOpen={handleModalOpen}
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
