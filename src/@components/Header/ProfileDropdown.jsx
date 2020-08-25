import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import {
  ProfilePicture,
  DropdownMenu,
  DropdownItem,
  useFlashNotification,
} from '@components'
import { useTranslations } from '@hooks'
import { authenticationService } from '@services'
import { createUseStyles } from '@style'

import { ReactComponent as ExitIcon } from '@svg/dropdown-signout.svg'
import { ReactComponent as HeartIcon } from '@svg/dropdown-heart.svg'
import { ReactComponent as NewFolderIcon } from '@svg/dropdown-folder.svg'
import { ReactComponent as UserIcon } from '@svg/dropdown-profile.svg'

const useStyles = createUseStyles(theme => {
  return {
    ProfileDropdown: {},
    ProfileDropdown_ClickableButton: {
      cursor: 'pointer',
    },
    ProfileDropdown_DropdownMenu: {
      margin: 'auto',
      marginLeft: '1rem',
      zIndex: 5,
    },
    ProfileDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
  }
})

const noop = () => null
export const ProfileDropdownMenu = ({
  dispatch,
  user,
  TargetComponent,
  handleNotificationsClick,
  notificationsIsOpen,
}) => {
  const c = useStyles({})
  const t = useTranslations({})
  const history = useHistory()
  const { navigateWithFlash } = useFlashNotification()
  const handleAfterCreate = useCallback(
    folder => {
      dispatch('close-modal')
      navigateWithFlash(
        `/folder/${folder.folderId}`,
        'Folder created successfully. If the provided unregistered email addresses, they will receive an email with instructions for accessing your folder.'
      )
    },
    [dispatch, navigateWithFlash]
  )

  return (
    <DropdownMenu
      className={c.ProfileDropdown_DropdownMenu}
      TargetComponent={TargetComponent}
      user={user}
    >
      <DropdownItem to='/profile/likes'>
        <HeartIcon /> {t('header.dropdownMenu.likedModels')}
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
        <NewFolderIcon /> {t('header.dropdownMenu.createFolder')}
      </DropdownItem>
      <hr className={c.ProfileDropdown_DropdownMenuDivider} />
      <DropdownItem to='/home'>
        <UserIcon /> {t('header.dropdownMenu.viewProfile')}
      </DropdownItem>
      <DropdownItem
        onClick={() => {
          if (notificationsIsOpen) handleNotificationsClick()
          dispatch('close-modal')
          setTimeout(() => {
            authenticationService.logout()
            history.push('/')
          }, 250)
        }}
      >
        <ExitIcon />
        {t('header.dropdownMenu.signOut')}
      </DropdownItem>
    </DropdownMenu>
  )
}

export const ProfileDropdown = ({ user, onClick = noop }) => {
  const c = useStyles({ inverted: false, notificationsIsOpen: false })

  return (
    <div
      className={c.ProfileDropdown_ClickableButton}
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
