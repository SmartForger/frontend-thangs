import React, { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import { Button } from '@components/Button'
import { UserInline } from '@components/UserInline'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { authenticationService } from '@services'
import classnames from 'classnames'
import { useCurrentUser } from '@customHooks/Users'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import useFetchOnce from '@services/store-service/hooks/useFetchOnce'

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
  }
})

const parseEmails = R.pipe(R.split(/, */), R.filter(R.identity))

const isEmptyMembers = ([key, info]) => {
  return key === 'members' && info.type === 'array.min'
}

const isEmptyTeamName = ([key, info]) => {
  return key === 'team' && info.type === 'string.empty'
}

const isInvalidEmail = ([key, info]) => {
  return key === 'members' && info.type === 'string.email'
}

const isDuplicateTeamName = ([key, info]) => {
  return key === 'team' && info.type === 'any.invalid'
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
    } else if (isEmptyMembers(error)) {
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
        const groupUser = typeof user === 'string' ? { email: user } : user
        const groupUserId = groupUser.id
        const isOwner =
          groupUser.id && groupUserId.toString() !== currentUserId.toString()

        if (groupUser.id && !groupUser.fullName)
          groupUser.fullName = `${groupUser.first_name} ${groupUser.last_name}`

        return (
          <li className={c.TeamForm_Item} key={idx}>
            <UserInline user={groupUser} size={'3rem'} displayEmail>
              {isOwner && (
                <Button text onClick={() => removeUser(groupUser)}>
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
  _membersLabel,
}) {
  const { dispatch, saveError } = useStoreon('folders')
  const { user: currentUser } = useCurrentUser()
  const [group, setGroup] = useState([])
  const { teams = {} } = useFetchOnce('teams')
  const { data: teamsData = [] } = teams
  const teamNames = teamsData.map(team => team.name)
  const c = useStyles()
  let errors

  useEffect(() => {
    if (saveError) onErrorReceived({ server: 'Error' })
  }, [saveError, onErrorReceived])

  const initSchema = Joi.object({
    members: Joi.array()
      .items(Joi.string().email({ tlds: { allow: false } }))
      .min(1)
      .required(),
    team: Joi.string()
      .required()
      .invalid(...teamNames),
  })

  const validationResolver = data => {
    const members = group
    const input = {
      team: data.team,
      members,
    }

    const { error, value: values } = initSchema.validate(input)

    errors = error
      ? error.details.reduce((previous, currentError) => {
          return {
            ...previous,
            [currentError.path[0]]: currentError,
          }
        }, {})
      : {}

    onErrorReceived(R.equals(errors, {}) ? undefined : errors)

    return {
      values: error ? {} : values,
      errors,
    }
  }

  const { handleSubmit, register, getValues, reset } = useForm({
    validationResolver,
    reValidateMode: 'onSubmit',
  })

  const handleAdd = useCallback(
    e => {
      e.preventDefault()
      if (
        getValues('members') &&
        !group.some(userToAdd => R.equals(userToAdd, getValues('members'))) &&
        !group.some(userToAdd => {
          return R.equals(userToAdd, currentUser.email)
        })
      ) {
        setGroup([...group, ...parseEmails(getValues('members'))])
      }
      reset({ ...getValues(), members: '' })
    },
    [getValues, group, reset, currentUser]
  )

  const handleSave = async ({ team, members }, e) => {
    e.preventDefault()
    const variables = {
      team,
      members,
    }
    dispatch('add-team', {
      data: variables,
      onFinish: () => {
        afterCreate(team)
      },
      onError: error => {
        onErrorReceived({
          server: error,
        })
      },
    })
  }

  const handleRemove = useCallback(
    userToRemove => {
      let newGroup = group
      newGroup = newGroup.filter(user => user.email !== userToRemove.email)
      setGroup(newGroup)
    },
    [group]
  )

  const handleCancel = e => {
    e.preventDefault()
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className={c.TeamForm}>
      <label className={c.TeamForm_Label} htmlFor='team'>
        Team Name
      </label>
      <input
        className={c.TeamForm_FullWidthInput}
        name='team'
        ref={register({ required: true })}
        onChange={() => {
          onErrorReceived(null)
        }}
      />
      <label className={c.TeamForm_Label} htmlFor='members'>
        Add users by email
      </label>
      <div className={c.TeamForm_MemberRow}>
        <input
          className={classnames(c.TeamForm_FullWidthInput, c.TeamForm_MemberInput)}
          name='members'
          ref={register({ required: true })}
          onChange={() => {
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
      <UserList users={[currentUser, ...group]} removeUser={handleRemove} />
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
