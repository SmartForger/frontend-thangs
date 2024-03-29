import React, { useCallback, useEffect, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { InviteUsersForm, ProfilePicture, Spacer } from '@components'
import { authenticationService } from '@services'
import * as types from '@constants/storeEventTypes'
import { overlayview } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import MobileDesktopTitle from '../@components/MobileDesktopTitle'

import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    InviteUsers: {
      height: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      width: '100%',

      [md]: {
        height: 'unset',
        flexDirection: 'row',
        width: 'unset',
      },
    },
    InviteUsers_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    InviteUsers_Column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    InviteUsers_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
    },
    InviteUsers_ViewerWrapper: {
      width: '100%',
      height: '24rem',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
      borderRadius: '1rem 1rem 0 0',
      position: 'relative',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.colors.white[900]}`,

      [md]: {
        height: '40rem',
        borderBottom: 'none',
        borderRight: `1px solid ${theme.colors.white[900]}`,
        borderRadius: '1rem 0 0 1rem',
      },
    },
    InviteUsers_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    InviteUsers_Wrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        width: '339px',
      },
    },
    InviteUsers_Item: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    InviteUsers_RemoveUser: {
      cursor: 'pointer',
    },
  }
})

const noop = () => null

const RevokeAccessButton = ({
  folderId,
  targetUserId,
  children,
  setErrorMessage = noop,
  onFinish = noop,
}) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const handleRevoke = async e => {
    e.preventDefault()
    dispatch(types.REVOKE_FOLDER_ACCESS, {
      folderId: folderId,
      userId: targetUserId,
      onError: setErrorMessage,
      onFinish,
    })
  }

  return (
    <div className={c.InviteUsers_RemoveUser} onClick={handleRevoke}>
      {children}
    </div>
  )
}

const UserList = ({
  users = [],
  folderId,
  creator,
  setErrorMessage,
  onFinish = noop,
}) => {
  const c = useStyles({})
  const currentUserId = authenticationService.getCurrentUserId()
  const isCurrentUserOwner =
    creator && creator.id && creator.id.toString() === currentUserId

  return (
    <ul className={c.InviteUsers_List}>
      {users.map((user, idx) => {
        const isOwner = user && user.isOwner
        const isPending = user && user.isPending
        return (
          <React.Fragment key={idx}>
            <li className={c.InviteUsers_Item}>
              <div className={c.InviteUsers_Row}>
                <ProfilePicture
                  className={c.ModelTitle_OwnerProfilePicture}
                  size='2.5rem'
                  name={user.fullName}
                  userName={user.username}
                  src={user.profile && user.profile.avatarUrl}
                />
                <Spacer size={'1rem'} />
                <div className={c.InviteUsers_Column}>
                  <Body>{user.username}</Body>
                  <Spacer size={'.5rem'} />
                  <Metadata type={MetadataType.secondary}>{user.email}</Metadata>
                </div>
              </div>
              {isCurrentUserOwner && !isOwner && !isPending && (
                <RevokeAccessButton
                  targetUserId={user && user.id}
                  folderId={folderId}
                  setErrorMessage={setErrorMessage}
                  onFinish={onFinish}
                >
                  <TrashCanIcon className={c.FolderManagement_TrashCanIcon} />
                </RevokeAccessButton>
              )}
              {isPending && (
                <span
                  className={c.FolderManagement_PendingFlag}
                  title={'Email invite has been sent'}
                >
                  Pending
                </span>
              )}
              {isOwner && (
                <span className={c.FolderManagement_PendingFlag} title={'Folder Admin'}>
                  Owner
                </span>
              )}
            </li>
            <Spacer size={'1rem'} />
          </React.Fragment>
        )
      })}
    </ul>
  )
}

const InviteUsers = ({ folderId: id }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { setOverlayOpen } = useOverlay()
  const { folders } = useStoreon('folders')
  const { data: allFolders = {} } = folders

  const folder = allFolders[id]

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  useEffect(() => {
    overlayview('InviteUsers')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!folder) {
    return (
      <div className={c.InviteUsers}>
        <ExitIcon className={c.InviteUsers_ExitButton} onClick={closeOverlay} />
        <div className={c.InviteUsers_Row}>
          <Spacer size='2rem' />
          <div className={c.InviteUsers_Wrapper}>
            <Spacer size='4rem' />
            <Body multiline>There was an error in loading. Please try again</Body>
            <Spacer size='2rem' />
          </div>
          <Spacer size='2rem' />
        </div>
      </div>
    )
  }

  return (
    <div className={c.InviteUsers}>
      <ExitIcon className={c.InviteUsers_ExitButton} onClick={closeOverlay} />
      <div className={c.InviteUsers_Row}>
        <Spacer size='2rem' />
        <div className={c.InviteUsers_Wrapper}>
          <Spacer size='4rem' />
          <MobileDesktopTitle>Add Users By Email</MobileDesktopTitle>
          <Spacer size='1rem' />
          <Body multiline>Users without accounts with be emailed.</Body>
          <Spacer size='1rem' />
          <InviteUsersForm
            folderId={folder.id}
            onError={setErrorMessage}
            errorMessage={errorMessage}
          />
          <Spacer size={'2rem'} />
          {folder && (
            <UserList
              creator={folder.creator}
              users={folder.members}
              folderId={folder.id}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
          <Spacer size='2rem' />
        </div>
        <Spacer size='2rem' />
      </div>
    </div>
  )
}

export default InviteUsers
