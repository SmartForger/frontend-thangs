import React, { useState, useCallback } from 'react'
import { useFlashNotification } from '@components/Flash'
import { useParams, useHistory, Link } from 'react-router-dom'
import { ProfilePicture } from '@components/ProfilePicture'
import { useCurrentUser } from '@customHooks/Users'
import { useUnreadNotificationCount } from '@customHooks/Notifications'
import { DropdownMenu, DropdownItem } from '@components/DropdownMenu'
import FolderCreateModal from '@components/FolderCreateModal'
import TeamCreateModal from '@components/TeamCreateModal'
// import { Button } from '@components/Button'
import { authenticationService } from '@services'
import classnames from 'classnames'
import { createUseStyles } from '@style'

import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as LogoText } from '@svg/logo-text.svg'
import { ReactComponent as PlusButton } from '@svg/icon-blue-circle-plus.svg'
import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass.svg'
import { ReactComponent as UploadModelToFolderIcon } from '@svg/upload-model-to-folder-icon.svg'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon-gray.svg'
import { ReactComponent as PencilIcon } from '@svg/icon-pencil.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Header: {
      width: '100%',
      position: 'absolute',
      background: 'none',
      top: 0,
      zIndex: 2,
    },
    Header_DesktopBoundary: {
      position: 'relative',
      margin: '3rem auto 1rem',
      maxWidth: theme.variables.maxWidth,
      flexGrow: 1,

      [md]: {
        margin: '3rem 6.25rem 1rem',
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
      margin: '2.75rem 0 auto',
      padding: '0 .75rem',
    },
    Header_Logo: {
      marginRight: '.75rem',
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
    Header_SignInLink: {
      ...theme.mixins.text.linkText,
      marginRight: '2rem',
    },
    Header_SignUpButton: {
      width: '5rem',
    },
    Header_NotificationIcon: {
      color: theme.colors.purple[400],
    },
    Header_NotificationLink: {
      height: '3rem',
      position: 'relative',
    },
    Header_SearchLink: {
      height: '3rem',
    },
    Header_UnreadBadge: {
      background: theme.colors.attention,
      borderRadius: '100%',
      color: theme.colors.white[400],
      width: '1rem',
      height: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '.625rem',
      fontWeight: 'bold',
      position: 'absolute',
      top: '.375rem',
      right: '-.25rem',
    },
    Header_DropdownIcon: {
      width: '3rem',
      height: '3rem',
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
    Header_ButtonsRow: {
      '& > a': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 1rem',
        '&:last-child': {
          marginRight: 0,
        },
      },
    },
  }
})

const NOTIFICATIONS_URL = '/notifications'

// const SignUp = ({ c }) => {
//   return (
//     <Link to='/signup/alpha'>
//       <Button className={c.Header_SignUpButton}>Sign up</Button>
//     </Link>
//   )
// }

const NotificationsButton = ({ c }) => {
  const { unreadNotificationCount } = useUnreadNotificationCount()

  return (
    <Link to={NOTIFICATIONS_URL} className={c.Header_NotificationLink}>
      <NotificationIcon className={c.Header_NotificationIcon} />
      {unreadNotificationCount > 0 && (
        <div className={c.Header_UnreadBadge}>{unreadNotificationCount}</div>
      )}
    </Link>
  )
}

const Search = ({ c }) => {
  return (
    <Link to='/search' className={c.Header_SearchLink}>
      <MagnifyingGlass />
    </Link>
  )
}

const UserPicture = ({ user }) => {
  return (
    <Link to='/home/'>
      <ProfilePicture name={user.fullName} src={user.profile?.avatarUrl} size='3rem' />
    </Link>
  )
}

const AddModelDropdownMenu = ({ c }) => {
  const { folderId } = useParams()
  const [createFolderIsOpen, setCreateFolderIsOpen] = useState(false)
  const [createTeamIsOpen, setCreateTeamIsOpen] = useState(false)
  const [newTeam, setNewTeam] = useState(null)
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
        <FolderCreateModal
          isOpen={createFolderIsOpen}
          onCancel={setFolderClose}
          onTeamModalOpen={() => {
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
          newTeamName={newTeam}
        />
      )}
      {createTeamIsOpen && (
        <TeamCreateModal
          isOpen={createTeamIsOpen}
          onCancel={() => {
            setTeamClose()
            setFolderOpen()
          }}
          afterCreate={newTeamName => {
            setTeamClose()
            setNewTeam(newTeamName)
            setFolderOpen()
          }}
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

const UserNav = ({ c }) => {
  const { loading, user } = useCurrentUser()

  if (loading) {
    return <div className={c.Header_Row}></div>
  }

  if (user) {
    return (
      <div className={classnames(c.Header_Row, c.Header_ButtonsRow)}>
        <Search c={c} />
        <NotificationsButton c={c} />
        <AddModelDropdownMenu c={c} />
        <UserPicture user={user} />
        <ProfileDropdownMenu c={c} />
      </div>
    )
  }

  return (
    // <div className={classnames(c.Header_Row, c.Header_ButtonsRow)}>
    //   <Search c={c} />
    //   <Link className={c.Header_SignInLink} to='/login'>
    //     Sign in
    //   </Link>
    //   <SignUp c={c} />
    // </div>
    null
  )
}

const DesktopHeader = ({ variant, c }) => {
  return (
    <span className={c.Header_DesktopOnly}>
      <div className={c.Header_DesktopBoundary}>
        <div className={classnames(c.Header_Row, c.Header_TopRow)}>
          <div>
            <div className={c.Header_Row}>
              <Link to='/'>
                <Logo className={c.Header_Logo} />
                <LogoText />
              </Link>
            </div>
          </div>
          {variant !== 'logo-only' && <UserNav c={c} />}
        </div>
      </div>
    </span>
  )
}

const MobileHeader = ({ variant, c }) => {
  return (
    <span className={c.Header_MobileOnly}>
      <div className={c.Header_MobileBoundary}>
        <div className={classnames(c.Header_Row, c.Header_TopRow)}>
          <Link to='/'>
            <Logo className={c.Header_Logo} />
          </Link>
          {variant !== 'logo-only' && <UserNav c={c} />}
        </div>
      </div>
    </span>
  )
}

const Header = ({ inverted, variant }) => {
  const c = useStyles({ inverted })
  return (
    <>
      <div className={c.Header}>
        <MobileHeader variant={variant} c={c} />
        <DesktopHeader variant={variant} c={c} />
      </div>
    </>
  )
}

export { Header }
