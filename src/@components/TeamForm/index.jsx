import React, { useCallback, useMemo } from 'react'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import { Button } from '@components/Button'
import { UserInline } from '@components/UserInline'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { authenticationService } from '@services'
import classnames from 'classnames'
import { useCurrentUser, useForm } from '@hooks'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import { useServices } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    TeamForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    TeamForm_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    TeamForm_Row: {
      display: 'flex',
    },
    TeamForm_TeamRow: {
      alignItems: 'flex-end',
    },
    TeamForm_ButtonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '3rem',
    },
    TeamForm_CancelButton: {
      marginRight: '1rem',
      minWidth: '7.25rem',
    },
    TeamForm_SaveButton: {
      minWidth: '6.75rem',
    },
    TeamForm_Label: {
      marginBottom: '.5rem',
    },
    TeamForm_FullWidthInput: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '1.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      background: theme.colors.white[900],
    },
    TeamForm_ControllerInput: {
      width: '100%',
    },
    TeamForm_ErrorText: {
      ...theme.mixins.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    TeamForm_SaveLogo: {
      margin: '26px 7px 0 auto',
    },
    TeamForm_SaveTeamLabel: {
      color: theme.colors.blue[500],
      cursor: 'pointer',
      marginTop: '1.625rem',
    },
    TeamForm_SaveTeamSuccessLabel: {
      color: theme.colors.grey[700],
      marginTop: '1.625rem',
    },
    TeamForm_PseudoForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',

      '& input': {
        border: 0,
        padding: '.5rem 1rem',
        borderRadius: '.5rem',
        minWidth: 0,
        background: theme.colors.white[900],
      },
    },
    TeamForm_AddButton: {
      minWidth: 0,
      marginLeft: '1rem',
    },
    TeamForm_MemberRow: {
      display: 'flex',
      marginBottom: '1.5rem',
    },
    TeamForm_MemberInput: {
      marginBottom: 0,
      width: '100%',
    },
    TeamForm_Item: {
      marginBottom: '1rem',
    },
    TeamForm_FolderNameLabel: {
      marginBottom: '1.5rem',
    },
    TeamForm_FolderName: {
      display: 'block',
      padding: '.5rem 1rem',
      ...theme.mixins.text.lightText,
    },
  }
})

const parseEmails = R.pipe(R.split(/, */), R.filter(R.identity))

const isEmptyMembers = ([key, info]) => {
  return key === 'teamMembers' && info.type === 'array.min'
}

const isEmptyTeam = ([key, info]) => {
  return key === 'emails' && info.type === 'array.min'
}

const isEmptyTeamName = ([key, info]) => {
  return key === 'teamName' && info.type === 'string.empty'
}

const isInvalidEmail = ([key, info]) => {
  return key === 'emails' && info.type === 'string.email'
}

const isDuplicateTeamName = ([key, info]) => {
  return key === 'teamName' && info.type === 'any.invalid'
}

const isExistingMember = ([key, info]) => {
  return key === 'teamMembers' && info.type === 'exists'
}

const isServerError = ([key, _info]) => {
  return key === 'server'
}

export const DisplayErrors = ({ errors, className, serverErrorMsg }) => {
  const c = useStyles()
  const messages = R.toPairs(errors)

  return messages.map((error, i) => {
    if (isEmptyTeamName(error)) {
      return (
        <h4 className={classnames(className, c.TeamForm_ErrorText)} key={i}>
          Please provide a team name for your folder
        </h4>
      )
    } else if (isInvalidEmail(error)) {
      return (
        <h4 className={classnames(className, c.TeamForm_ErrorText)} key={i}>
          Please check that you have provided valid emails
        </h4>
      )
    } else if (isEmptyMembers(error) || isEmptyTeam(error)) {
      return (
        <h4 className={classnames(className, c.TeamForm_ErrorText)} key={i}>
          Please invite at least one other member
        </h4>
      )
    } else if (isDuplicateTeamName(error)) {
      return (
        <h4 className={classnames(className, c.TeamForm_ErrorText)} key={i}>
          Team name already exists. Please try another
        </h4>
      )
    } else if (isExistingMember) {
      return (
        <h4 className={classnames(className, c.TeamForm_ErrorText)} key={i}>
          Team member already added. Please try another email
        </h4>
      )
    } else if (isServerError(error)) {
      return (
        <h4 className={classnames(className, c.TeamForm_ErrorText)} key={i}>
          {serverErrorMsg}
        </h4>
      )
    } else {
      return null
    }
  })
}

const noop = () => null
const UserList = ({ users = [], removeUser = noop }) => {
  const c = useStyles({})
  const currentUserId = authenticationService.getCurrentUserId()

  return (
    <ul>
      {users.map((user, idx) => {
        const teamUser = typeof user === 'string' ? { email: user } : user
        const teamUserId = teamUser.id
        const isOwner = teamUser.id && teamUserId.toString() !== currentUserId.toString()

        if (teamUser.id && !teamUser.fullName)
          teamUser.fullName = `${teamUser.first_name} ${teamUser.last_name}`

        return (
          <li className={c.TeamForm_Item} key={idx}>
            <UserInline user={teamUser} size={'3rem'} displayEmail>
              {isOwner && (
                <Button text onClick={() => removeUser(teamUser)}>
                  <TrashCanIcon />
                </Button>
              )}
            </UserInline>
          </li>
        )
      })}
    </ul>
  )
}

export function CreateTeamForm({
  onErrorReceived,
  afterCreate,
  onCancel,
  newFolderData = {},
}) {
  const { dispatch } = useStoreon('folders')
  const { user: currentUser } = useCurrentUser()
  const { useFetchPerMount } = useServices()
  const { atom: teams } = useFetchPerMount('teams')
  const { folderName, members = '' } = newFolderData
  const c = useStyles()
  let teamNames = []
  if (teams && teams.data) {
    teams.data.forEach(team => {
      teamNames.push(team.name)
    })
  }

  const initSchema = Joi.object({
    teamMembers: Joi.array()
      .min(1)
      .required(),
    teamName: Joi.string()
      .required()
      .invalid(...teamNames),
    emails: Joi.any(),
  })

  const emailsSchema = Joi.object({
    emails: Joi.array()
      .items(Joi.string().email({ tlds: { allow: false } }))
      .min(1)
      .required(),
  })

  const initialState = {
    teamName: '',
    emails: members,
    teamMembers: [],
  }

  const { onFormSubmit, onInputChange, inputState, clearAllInputs } = useForm({
    initialValidationSchema: initSchema,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleAdd = useCallback(
    e => {
      e.preventDefault()
      const emails = inputState['emails']
      const emailsArray = [...parseEmails(emails)]
      const { error } = emailsSchema.validate({
        emails: emailsArray,
      })
      const errors = error
        ? /* eslint-disable indent */
          error.details.reduce((previous, currentError) => {
            return {
              ...previous,
              [currentError.path[0]]: currentError,
            }
          }, {})
        : {}
      /* eslint-enable indent */
      if (error) return onErrorReceived(errors)
      if (
        !emailsArray.some(emailToInvite =>
          inputState['teamMembers'].includes(emailToInvite)
        ) &&
        !emailsArray.some(emailToInvite => {
          return R.equals(emailToInvite, currentUser.email)
        })
      ) {
        onInputChange('teamMembers', [...inputState['teamMembers'], ...emailsArray])
        onInputChange('emails', '')
      } else {
        onInputChange('emails', '')
        return onErrorReceived({
          team: {
            path: ['teamMembers'],
            type: 'exists',
          },
        })
      }
    },
    [inputState, emailsSchema, onErrorReceived, currentUser, onInputChange]
  )

  const handleSave = useCallback(
    (_state, isValid, errors) => {
      if (!isValid) {
        return onErrorReceived(errors)
      }
      const addTeamVariables = {
        teamName: inputState['teamName'],
        teamMembers: inputState['teamMembers'],
      }
      const createFolderVariables = {
        name: folderName,
        members: [inputState['teamName']],
      }
      dispatch('add-team', {
        data: addTeamVariables,
        onFinish: () => {
          dispatch('create-folder', {
            data: createFolderVariables,
            onFinish: folder => {
              afterCreate(folder)
            },
            onError: error => {
              onErrorReceived({
                server: error,
              })
            },
          })
        },
        onError: error => {
          onErrorReceived({
            server: error,
          })
        },
      })
    },
    [inputState, folderName, dispatch, onErrorReceived, afterCreate]
  )

  const handleRemove = useCallback(
    userToRemove => {
      let newTeam = inputState['teamMembers']
      newTeam = newTeam.filter(user => user.email !== userToRemove.email)
      onInputChange('teamMembers', newTeam)
    },
    [inputState, onInputChange]
  )

  const handleCancel = useCallback(
    e => {
      e.preventDefault()
      clearAllInputs()
      onCancel()
    },
    [clearAllInputs, onCancel]
  )

  const team = useMemo(() => {
    return inputState['teamMembers'] ? inputState['teamMembers'] : []
  }, [inputState])

  return (
    <form onSubmit={onFormSubmit(handleSave)} className={c.TeamForm}>
      <div className={c.TeamForm_FolderNameLabel}>
        Folder Name
        <div className={c.TeamForm_FolderName}>{folderName}</div>
      </div>
      <label className={c.TeamForm_Label} htmlFor='teamMembers'>
        Team Name
      </label>
      <input
        className={c.TeamForm_FullWidthInput}
        name='teamName'
        type='text'
        value={inputState['teamName']}
        onChange={e => {
          handleOnInputChange('teamName', e.target.value)
          onErrorReceived(null)
        }}
      />
      <label className={c.TeamForm_Label} htmlFor='emails'>
        Add users by email
      </label>
      <div className={c.TeamForm_MemberRow}>
        <input
          className={classnames(c.TeamForm_FullWidthInput, c.TeamForm_MemberInput)}
          placeholder={'member1@example.com, member2@example.com'}
          name='emails'
          type='text'
          value={inputState['emails']}
          onChange={e => {
            handleOnInputChange('emails', e.target.value)
            onErrorReceived(null)
          }}
        />
        <Button
          type='button'
          className={classnames(c.TeamForm_SaveButton, c.TeamForm_AddButton)}
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
      <UserList users={[currentUser, ...team]} removeUser={handleRemove} />
      <div className={classnames(c.TeamForm_Row, c.TeamForm_ButtonRow)}>
        <Button
          dark
          className={c.TeamForm_CancelButton}
          onClick={handleCancel}
          type='button'
        >
          Back
        </Button>
        <Button type='submit' className={c.TeamForm_SaveButton}>
          Save & Create Folder
        </Button>
      </div>
    </form>
  )
}
