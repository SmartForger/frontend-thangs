import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import { Button } from '../Button'
import { Spinner } from '../Spinner'
import { useInviteToFolder } from '@customHooks/Folders'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import teamLogo from '@svg/multi-users.svg'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useStoreon } from 'storeon/react'
import useFetchPerMount from '@services/store-service/hooks/useFetchPerMount'

const useStyles = createUseStyles(theme => {
  return {
    FolderForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    FolderForm_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    FolderForm_Row: {
      display: 'flex',
    },
    FolderForm_TeamRow: {
      alignItems: 'flex-end',
    },
    FolderForm_ButtonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '3rem',
    },
    FolderForm_CancelButton: {
      marginRight: '1rem',
      minWidth: '7.25rem',
    },
    FolderForm_SaveButton: {
      minWidth: '6.75rem',
    },
    FolderForm_Label: {
      marginBottom: '.5rem',
    },
    FolderForm_FullWidthInput: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '1.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      background: theme.colors.white[900],
    },
    FolderForm_ErrorText: {
      ...theme.mixins.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    FolderForm_SaveLogo: {
      margin: '26px 7px 0 auto',
    },
    FolderForm_SaveTeamLabel: {
      color: theme.colors.blue[500],
      cursor: 'pointer',
      marginTop: '1.625rem',
    },
    FolderForm_PseudoForm: {
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
    FolderForm_MemberInput: {
      marginBottom: 0,
      width: '100%',
    },
  }
})

//TODO - Abstract Joi Objects to constants i.e. constants/inputs/validation
//TODO - or Input Components for specific-field reuse - BE
//Question - Does Joi have chaining ability?
let initSchema = Joi.object({
  name: Joi.string().required(),
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
  team: Joi.string().allow(''),
})

const autocompleteSchema = Joi.object({
  name: Joi.string().required(),
  members: Joi.array()
    .items(Joi.string())
    .required(),
  team: Joi.string().allow(''),
})

const schemaWithName = Joi.object({
  name: Joi.string().required(),
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
  team: Joi.string().allow(''),
})

const schemaWithoutName = Joi.object({
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
})

const schemaJustName = Joi.object({
  name: Joi.string().required(),
})

const parseEmails = R.pipe(R.split(/, */), R.filter(R.identity))

const isEmptyMembers = ([key, info]) => {
  return key === 'members' && info.type === 'array.min'
}

const isEmptyName = ([key, info]) => {
  return key === 'name' && info.type === 'string.empty'
}

const isInvalidEmail = ([key, info]) => {
  return key === 'members' && info.type === 'string.email'
}

const isServerError = ([key, _info]) => {
  return key === 'server'
}

export const DisplayErrors = ({ errors, className, serverErrorMsg }) => {
  const c = useStyles()
  const messages = R.toPairs(errors)

  return messages.map((error, i) => {
    if (isEmptyMembers(error)) {
      return (
        <h4 className={classnames(className, c.FolderForm_ErrorText)} key={i}>
          Please invite at least one other member
        </h4>
      )
    } else if (isInvalidEmail(error)) {
      return (
        <h4 className={classnames(className, c.FolderForm_ErrorText)} key={i}>
          Please check that you have provided valid emails
        </h4>
      )
    } else if (isEmptyName(error)) {
      return (
        <h4 className={classnames(className, c.FolderForm_ErrorText)} key={i}>
          Please provide a name for your folder
        </h4>
      )
    } else if (isServerError(error)) {
      return (
        <h4 className={classnames(className, c.FolderForm_ErrorText)} key={i}>
          {serverErrorMsg}
        </h4>
      )
    } else {
      return null
    }
  })
}

const noop = () => null

const buildErrors = error => {
  /* eslint-disable indent */
  const errors = error
    ? error.details.reduce((previous, currentError) => {
        return {
          ...previous,
          [currentError.path[0]]: currentError,
        }
      }, {})
    : {}
  /* eslint-enable indent */

  return R.equals(errors, {}) ? undefined : errors
}

export function CreateFolderForm({
  onErrorReceived = noop,
  afterCreate = noop,
  onCancel = noop,
  onTeamModelOpen = noop,
  _membersLabel,
}) {
  const { dispatch } = useStoreon('folders')
  const { atom: teams } = useFetchPerMount('teams')
  const c = useStyles()

  const teamNames = (teams.data && Object.values(teams.data).map(team => team.name)) || []

  const validationResolver = ({ members, name }) => {
    const input = {
      name: name,
      members: members ? parseEmails(members) : [],
    }
    if (teamNames.indexOf(members) > -1) {
      initSchema = autocompleteSchema
    } else {
      initSchema = schemaWithName
    }

    const { error, value: values } = initSchema.validate(input)
    const errors = buildErrors(error)
    if (errors) onErrorReceived(errors)

    return {
      values: error ? {} : values,
      errors: errors || {},
    }
  }

  const { handleSubmit, control, getValues } = useForm({
    validationResolver,
    reValidateMode: 'onSubmit',
  })

  const handleSave = async ({ name, members }, e) => {
    e.preventDefault()
    const variables = {
      name,
      members,
    }
    dispatch('create-folder', {
      data: variables,
      onFinish: folder => {
        afterCreate(folder)
      },
      onError: error => {
        onErrorReceived({
          server: error,
        })
      },
    })
  }

  const handleCancel = e => {
    e.preventDefault()
    onCancel()
  }

  const handleOnCreateTeam = () => {
    const { error } = schemaJustName.validate({ name: getValues('name') })
    const errors = buildErrors(error)
    if (errors) return onErrorReceived(errors)
    onTeamModelOpen({ folderName: getValues('name'), members: getValues('members') })
  }

  const addSaveGroupFields = () => {
    return (
      <>
        <div className={classnames(c.FolderForm_Row, c.FolderForm_TeamRow)}>
          <img alt={'Create Team'} className={c.FolderForm_SaveLogo} src={teamLogo} />
          <label
            className={c.FolderForm_SaveTeamLabel}
            onClick={() => handleOnCreateTeam()}
          >
            Create Team
          </label>
        </div>
      </>
    )
  }

  return (
    <form className={c.FolderForm} onSubmit={handleSubmit(handleSave)}>
      <label className={c.FolderForm_Label} htmlFor='name'>
        Folder Name
      </label>
      <Controller
        name='name'
        control={control}
        defaultValue=''
        as={<input className={c.FolderForm_FullWidthInput} name='name' />}
      />
      <label className={c.FolderForm_Label} htmlFor='members'>
        Add users by email or enter an existing team name
      </label>
      <Controller
        name='members'
        control={control}
        onChange={([_e, data]) => data}
        onInputChange={(_e, data) => data}
        as={
          <Autocomplete
            id='members'
            freeSolo
            autoSelect
            options={teamNames}
            renderInput={params => (
              <div className={c.FolderForm_PseudoForm} ref={params.InputProps.ref}>
                <input {...params.inputProps} />
              </div>
            )}
          />
        }
      />
      {addSaveGroupFields()}
      <div className={classnames(c.FolderForm_Row, c.FolderForm_ButtonRow)}>
        <Button
          dark
          className={c.FolderForm_CancelButton}
          onClick={handleCancel}
          type='button'
        >
          Cancel
        </Button>
        <Button
          className={c.FolderForm_SaveButton}
          type='submit'
          disabled={teams.isLoading}
        >
          {teams.isLoading ? <Spinner className={c.FolderForm_Spinner} /> : 'Save'}
        </Button>
      </div>
    </form>
  )
}

export const InviteUsersForm = ({ folderId, onErrorReceived, afterInvite, onCancel }) => {
  const c = useStyles()
  const validationResolver = ({ members }) => {
    const input = { members: members ? parseEmails(members) : [] }

    const { error, value: values } = schemaWithoutName.validate(input)

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

    onErrorReceived(R.equals(errors, {}) ? undefined : errors)

    return {
      values: error ? {} : values,
      errors,
    }
  }

  const { register, handleSubmit } = useForm({
    validationResolver,
    reValidateMode: 'onSubmit',
  })

  const [inviteToFolder, { loading }] = useInviteToFolder(folderId)

  const handleSave = async (data, e) => {
    e.preventDefault()
    try {
      const variables = { emails: data.members }
      await inviteToFolder({
        variables,
      })
      afterInvite(data)
    } catch (error) {
      onErrorReceived({
        server: error,
      })
    }
  }

  const handleCancel = e => {
    e.preventDefault()
    onCancel()
  }
  return (
    <form className={c.FolderForm} onSubmit={handleSubmit(handleSave)}>
      <label className={c.FolderForm_Label} htmlFor='members'>
        Add users by email
      </label>
      <input
        className={c.FolderForm_FullWidthInput}
        name='members'
        ref={register({ required: true })}
        placeholder='example@example.com'
      />
      <div className={classnames(c.FolderForm_Row, c.FolderForm_ButtonRow)}>
        <Button
          className={c.FolderForm_CancelButton}
          dark
          onClick={handleCancel}
          type='button'
        >
          Cancel
        </Button>
        <Button className={c.FolderForm_SaveButton} type='submit'>
          {loading ? <Spinner className={c.FolderForm_Spinner} /> : 'Invite'}
        </Button>
      </div>
    </form>
  )
}
