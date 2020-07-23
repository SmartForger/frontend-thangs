import React, { useState } from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import { UserInline } from '../UserInline'
import Modal from '../Modal'
import { authenticationService } from '../../@services'
import { Button } from '../Button'
import { InviteUsersForm, DisplayErrors } from '../FolderForm'
import FolderInfo from '../FolderInfo'
import { Spinner } from '../Spinner'
import { ReactComponent as TrashCanIcon } from '../../@svg/trash-can-icon.svg'
import { ReactComponent as ErrorIcon } from '../../@svg/error-triangle.svg'
import { useRevokeAccess } from '../../@customHooks/Folders'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    FolderManagementModal: {
      width: '100%',
      [md]: {
        maxWidth: '31.25rem',
      },
    },
    FolderManagementModal_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    FolderManagementModal_Icon: {
      width: '1rem',
      height: '1rem',
    },
    FolderManagementModal_Row: {
      display: 'flex',
    },
    FolderManagementModel_TopRow: {
      marginTop: ({ hasErrors }) => (hasErrors ? '16px' : '70px'),
    },
    FolderManagementModel_BottomRow: {
      marginTop: '3rem',
    },
    FolderManagementModal_List: {
      width: '100%',
    },
    FolderManagementModal_Item: {
      display: 'block',
      marginTop: '1rem',
    },
    FolderManagementModal_Item__isFirst: {
      marginTop: 0,
    },
    FolderManagementModal_TrashCanIcon: {
      color: theme.colors.grey[500],
    },
  }
})

const RevokeAccessButton = ({ folderId, targetUserId, children }) => {
  const c = useStyles()
  const [revokeAccess, { loading, error }] = useRevokeAccess(folderId, targetUserId)
  const handleRevoke = async e => {
    e.preventDefault()
    try {
      await revokeAccess({
        variables: {
          userId: targetUserId,
        },
      })
    } catch (e) {
      console.error('e', e)
    }
  }

  return (
    <Button text onClick={handleRevoke}>
      {loading ? (
        <Spinner className={c.FolderManagementModal_Spinner} />
      ) : error ? (
        <ErrorIcon className={c.FolderManagementModal_Icon} />
      ) : (
        children
      )}
    </Button>
  )
}

const UserList = ({ users = [], folderId, creator }) => {
  const c = useStyles()
  const currentUserId = authenticationService.getCurrentUserId()

  return (
    <ul className={c.FolderManagementModal_List}>
      {users.map((user, idx) => {
        const isFirst = idx === 0
        return (
          <li
            className={classnames(c.FolderManagementModal_Item, {
              [c.FolderManagementModal_Item__isFirst]: isFirst,
            })}
            key={idx}
          >
            <UserInline user={user} displayEmail>
              {user.id !== currentUserId && creator.id !== user.id && (
                <RevokeAccessButton targetUserId={user.id} folderId={folderId}>
                  <TrashCanIcon className={c.FolderManagementModal_TrashCanIcon} />
                </RevokeAccessButton>
              )}
            </UserInline>
          </li>
        )
      })}
    </ul>
  )
}

const FolderManagementModal = ({ isOpen, folder, afterInvite, onCancel, className }) => {
  const [errors, setErrors] = useState()
  const hasErrors = errors && !R.isEmpty(errors)
  const c = useStyles({ hasErrors })
  return (
    <Modal isOpen={isOpen} className={classnames(className, c.FolderManagementModal)}>
      <FolderInfo
        name={folder.name}
        members={folder.members}
        models={folder.models}
        boldName
        hideModels
        css={`
          padding: 0;
        `}
      />
      <DisplayErrors
        errors={errors}
        css={`
          margin-top: 16px;
        `}
        serverErrorMsg='Unable to invite users. Please try again later.'
      />
      <div
        className={classnames(
          c.FolderManagementModal_Row,
          c.FolderManagementModal_TopRow
        )}
      >
        <InviteUsersForm
          folderId={folder.id}
          onErrorReceived={setErrors}
          afterInvite={afterInvite}
          onCancel={onCancel}
        />
      </div>
      <div
        className={classnames(
          c.FolderManagementModal_Row,
          c.FolderManagementModal_BottomRow
        )}
      >
        <UserList creator={folder.creator} users={folder.members} folderId={folder.id} />
      </div>
    </Modal>
  )
}

export default FolderManagementModal
