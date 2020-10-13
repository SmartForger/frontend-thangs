import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import {
  Spacer,
  InviteUsersForm,
  TitleTertiary,
  MultiLineBodyText,
  ProfilePicture,
  MetadataSecondary,
  SingleLineBodyText,
} from '@components'
import { createUseStyles } from '@style'
import { authenticationService } from '@services'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    InviteUsers: {
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',

      [md]: {
        flexDirection: 'row',
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
      zIndex: 4,
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
      width: '339px',
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
  const isCurrentUserOwner = creator.id.toString() === currentUserId

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
                  <SingleLineBodyText>{user.username}</SingleLineBodyText>
                  <Spacer size={'.5rem'} />
                  <MetadataSecondary>{user.email}</MetadataSecondary>
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

const findFolderById = (id, folders) => {
  return R.find(R.propEq('id', id.toString()))(folders) || {}
}

const InviteUsers = ({ folderId: id }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch, folders } = useStoreon('folders')
  const { data: folderData = {} } = folders
  const folder = useMemo(() => {
    return !R.isEmpty(folderData) ? findFolderById(id, folderData) : undefined
  }, [folderData, id])

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  return (
    <div className={c.InviteUsers}>
      <ExitIcon className={c.InviteUsers_ExitButton} onClick={closeOverlay} />
      <div className={c.InviteUsers_Row}>
        <Spacer size='2rem' />
        <div className={c.InviteUsers_Wrapper}>
          <Spacer size='4rem' />
          <TitleTertiary>Add Users By Email</TitleTertiary>
          <Spacer size='1rem' />
          <MultiLineBodyText>Users without accounts with be emailed.</MultiLineBodyText>
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
        <Spacer className={c.InviteUsers} size='2rem' />
      </div>
    </div>
  )
}

export default InviteUsers