import React, { useEffect, useState } from 'react'
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
import { useStoreon } from 'storeon/react'

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
    FolderManagementModal_AddUsersForm: {
      marginTop: ({ hasErrors }) => (hasErrors ? '1rem' : '4.375rem'),
    },
    FolderManagementModal_BottomRow: {
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
    FolderManagementModal_FolderInfo: {
      padding: 0,
    },
    FolderManagementModal_DisplayErrors: {
      marginTop: '1rem',
    },
    FolderManagementModal_TeamName: {
      ...theme.mixins.text.smallHeaderText,
    },
  }
})

const RevokeAccessButton = ({ folderId, targetUserId, children }) => {
  const c = useStyles({})
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
  const c = useStyles({})
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

const Team = ({ id }) => {
  const c = useStyles({})
  const { dispatch, teams } = useStoreon('teams')

  useEffect(() => {
    dispatch('fetch-team', id)
  }, [])

  return teams.isLoaded ? (
    <>
      <div
        className={c.FolderManagementModal_Row}
        css={`
          margin-top: 24px;
        `}
      >
        <div className={c.FolderManagementModal_TeamName} key={teams.currentTeam?.name}>
          {teams.currentTeam?.name}
        </div>
      </div>

      <div className={c.FolderManagementModal_Row}>
        <ul className={c.FolderManagementModal_List} key={teams.currentTeam?.members}>
          {teams.currentTeam?.members.map(member => {
            return (
              <div key={member}>
                <li className={c.FolderManagementModal_Item} key={member}>
                  {member}
                </li>
              </div>
              /*<Item
                                    key={member.id}
                                    css={`
                                        margin-top: ${props =>
                                        props.isFirst ? '0' : '16px'};
                                    `}
                                >
                                    <UserInline user={member} displayEmail>
                                        <RevokeAccessButton
                                            targetUserId={member.id}
                                        >
                                            <TrashCanIconStyled />
                                        </RevokeAccessButton>
                                    </UserInline>
                                </Item>*/
            )
          })}
        </ul>
      </div>
    </>
  ) : (
    <Spinner className={c.FolderManagementModal_Spinner} />
  )
}

const FolderManagementModal = ({ isOpen, folder, afterInvite, onCancel, className }) => {
  const [errors, setErrors] = useState()
  const hasErrors = errors && !R.isEmpty(errors)
  const c = useStyles({ hasErrors })
  return (
    <Modal isOpen={isOpen} className={classnames(className, c.FolderManagementModal)}>
      <FolderInfo
        className={c.FolderManagementModal_FolderInfo}
        name={folder.name}
        members={folder.members}
        models={folder.models}
        boldName
        hideModels
      />
      <DisplayErrors
        className={c.FolderManagementModal_DisplayErrors}
        errors={errors}
        serverErrorMsg='Unable to invite users. Please try again later.'
      />
      <div
        className={classnames(
          c.FolderManagementModal_Row,
          c.FolderManagementModal_AddUsersForm
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
        {folder.team_id ? (
          <Team key={folder.team_id} id={folder.team_id} />
        ) : (
          <div
            className={c.FolderManagementModal_Row}
            css={`
              margin-top: 48px;
            `}
          >
            <UserList
              creator={folder.creator}
              users={folder.members}
              folderId={folder.id}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default FolderManagementModal
