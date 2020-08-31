import React, { useState } from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import {
  Button,
  FolderInfo,
  InviteUsersForm,
  DisplayFolderFormErrors,
  Spinner,
  UserInline,
} from '@components'
import { authenticationService } from '@services'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    FolderManagement: {
      width: '100%',
      margin: '3rem auto',
    },
    FolderManagement_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    FolderManagement_Icon: {
      width: '1rem',
      height: '1rem',
    },
    FolderManagement_Row: {
      display: 'flex',
    },
    FolderManagement_AddUsersForm: {
      marginTop: ({ hasErrors }) => (hasErrors ? '1rem' : '4.375rem'),
    },
    FolderManagement_BottomRow: {
      marginTop: '2rem',
      width: '100%',
    },
    FolderManagement_List: {
      width: '100%',
    },
    FolderManagement_Item: {
      display: 'block',
      marginTop: '1rem',
    },
    FolderManagement_Item__isFirst: {
      marginTop: 0,
    },
    FolderManagement_TrashCanIcon: {
      color: theme.colors.grey[500],
    },
    FolderManagement_FolderInfo: {
      padding: 0,
    },
    FolderManagement_DisplayErrors: {
      marginTop: '1rem',
    },
    FolderManagement_TeamContainer: {
      flexDirection: 'column',
    },
    FolderManagement_TeamNameContainer: {
      marginBottom: '1rem',
    },
    FolderManagement_TeamName: {
      ...theme.mixins.text.smallHeaderText,
    },
    FolderManagement_UserInline: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    FolderManagement_PendingFlag: {
      textTransform: 'uppercase',
      backgroundColor: theme.colors.grey[100],
      borderRadius: '.25rem',
      color: 'white',
      letterSpacing: '.16em',
      fontWeight: 'bold',
      fontSize: '11px',
      lineHeight: '16px',
      padding: '1px 2px 2px 3px',
    },
  }
})

const RevokeAccessButton = ({ folderId, targetUserId, children }) => {
  const c = useStyles({})
  const { dispatch, folders } = useStoreon('folders')
  const handleRevoke = async e => {
    e.preventDefault()
    try {
      dispatch(types.REVOKE_FOLDER_ACCESS, { folderId: folderId, userId: targetUserId })
    } catch (e) {
      console.error('e', e)
    }
  }

  return (
    <Button text onClick={handleRevoke}>
      {folders.isLoading ? (
        <Spinner className={c.FolderManagement_Spinner} />
      ) : folders.isError ? (
        <ErrorIcon className={c.FolderManagement_Icon} />
      ) : (
        children
      )}
    </Button>
  )
}

const UserList = ({ users = [], folderId, creator }) => {
  const c = useStyles({})
  const currentUserId = authenticationService.getCurrentUserId()
  const isCurrentUserOwner = creator === currentUserId
  return (
    <ul className={c.FolderManagement_List}>
      {users.map((user, idx) => {
        const isOwner = user && user.isOwner
        const isPending = user && user.isPending
        return (
          <li className={c.FolderManagement_Item} key={idx}>
            <UserInline
              className={c.FolderManagement_UserInline}
              user={user}
              size={'3rem'}
              isPending={isPending}
              displayEmail
            >
              {isCurrentUserOwner && !isOwner && !isPending && (
                <RevokeAccessButton targetUserId={user && user.id} folderId={folderId}>
                  <TrashCanIcon className={c.FolderManagement_TrashCanIcon} />
                </RevokeAccessButton>
              )}
              {isPending && (
                <span
                  className={c.FolderManagement_PendingFlag}
                  title={'Email invite has been sent'}
                >
                  Pending Invite
                </span>
              )}
              {isOwner && (
                <span className={c.FolderManagement_PendingFlag} title={'Folder Admin'}>
                  Owner/Admin
                </span>
              )}
            </UserInline>
          </li>
        )
      })}
    </ul>
  )
}

const FolderManagement = ({ folder, afterInvite, className }) => {
  const [errors, setErrors] = useState()
  const hasErrors = errors && !R.isEmpty(errors)
  const { folders } = useStoreon('folders')
  const c = useStyles({ hasErrors })
  return (
    <div className={classnames(className, c.FolderManagement)}>
      <FolderInfo
        className={c.FolderManagement_FolderInfo}
        name={folder.name}
        members={folder.members}
        models={folder.models}
        boldName
        hideModels
      />
      <DisplayFolderFormErrors
        className={c.FolderManagement_DisplayErrors}
        errors={errors}
        serverErrorMsg='Unable to invite users. Please try again later.'
      />
      <div
        className={classnames(c.FolderManagement_Row, c.FolderManagement_AddUsersForm)}
      >
        <InviteUsersForm
          folderId={folder.id}
          onErrorReceived={setErrors}
          afterInvite={afterInvite}
        />
      </div>
      <div
        className={classnames(
          c.FolderManagement_Row,
          c.FolderManagement_BottomRow,
          c.FolderManagement_TeamContainer
        )}
      >
        {/* {folder.team_id ? (
          <Team
            key={folder.team_id}
            id={folder.team_id}
            creator={folder.creator}
            folderId={folder.id}
          />
        ) : ( */}
        <UserList
          creator={folders.currentFolder.creator}
          users={folders.currentFolder.members}
          folderId={folders.currentFolder.id}
        />
        {/* )} */}
      </div>
    </div>
  )
}

export default FolderManagement
