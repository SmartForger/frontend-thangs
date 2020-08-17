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

const useStyles = createUseStyles(theme => {
  return {
    FolderManagement: {
      width: '40vw',
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
      marginTop: '3rem',
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
  }
})

const RevokeAccessButton = ({ folderId, targetUserId, children }) => {
  const c = useStyles({})
  const { dispatch, folders } = useStoreon('folders')
  const handleRevoke = async e => {
    e.preventDefault()
    try {
      dispatch('revoke-folder-access', { folderId: folderId, userId: targetUserId })
    } catch (e) {
      console.error('e', e)
    }
  }

  return (
    <Button text onClick={handleRevoke}>
      {folders.isLoading ? (
        <Spinner className={c.FolderManagement_Spinner} />
      ) : folders.loadError ? (
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

  return (
    <ul className={c.FolderManagement_List}>
      {users.map((user, idx) => {
        const isFirst = idx === 0
        const groupUser = user
        const groupUserId = groupUser.id
        const isOwner =
          groupUserId.toString() !== currentUserId.toString() &&
          creator.toString() !== groupUserId.toString()

        if (!groupUser.fullName)
          groupUser.fullName = `${groupUser.first_name} ${groupUser.last_name}`
        return (
          <li
            className={classnames(c.FolderManagement_Item, {
              [c.FolderManagement_Item__isFirst]: isFirst,
            })}
            key={idx}
          >
            <UserInline
              className={c.FolderManagement_UserInline}
              user={groupUser}
              size={'3rem'}
              displayEmail
            >
              {isOwner && (
                <RevokeAccessButton targetUserId={groupUser.id} folderId={folderId}>
                  <TrashCanIcon className={c.FolderManagement_TrashCanIcon} />
                </RevokeAccessButton>
              )}
            </UserInline>
          </li>
        )
      })}
    </ul>
  )
}

// const Team = ({ id, creator, folderId }) => {
//   const c = useStyles({})
//   const { dispatch, teams } = useStoreon('teams')

//   useEffect(() => {
//     dispatch('fetch-team', id)
//   }, [dispatch, id])

//   return teams.isLoaded ? (
//     <>
//       <div className={c.FolderManagement_TeamNameContainer}>
//         <div
//           className={c.FolderManagement_TeamName}
//           key={teams && teams.currentTeam && teams.currentTeam.name}
//         >
//           {teams && teams.currentTeam && teams.currentTeam.name}
//         </div>
//       </div>
//       <div className={c.FolderManagement_Row}>
//         <ul
//           className={c.FolderManagement_List}
//           key={teams && teams.currentTeam && teams.currentTeam.members}
//         >
//           <UserList
//             creator={creator}
//             users={
//               teams && teams.currentTeam && teams.currentTeam.members
//                 ? teams.currentTeam.members
//                 : []
//             }
//             folderId={folderId}
//           />
//         </ul>
//       </div>
//     </>
//   ) : (
//     <Spinner className={c.FolderManagement_Spinner} />
//   )
// }

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
