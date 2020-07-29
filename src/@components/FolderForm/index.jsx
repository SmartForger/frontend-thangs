import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import { Button } from '../Button'
import { Spinner } from '../Spinner'
import { useInviteToFolder } from '../../@customHooks/Folders'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import teamLogo from '../../@svg/multi-users.svg'
import saveTeamLogo from '../../@svg/save-team.svg'
import saveTeamSuccess from '../../@svg/save-team-success.svg'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useStoreon } from 'storeon/react'
import api from '../../@services/api'
import useFetchOnce from '../../@services/store-service/hooks/useFetchOnce'

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
    FolderForm_TeamLabel: {
      marginTop: '1.5rem',
    },
    FolderForm_FullWidthInput: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '1.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      background: theme.colors.white[900],
    },
    FolderForm_ControllerInput: {
      width: '100%',
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
    FolderForm_SaveTeamSuccessLabel: {
      color: theme.colors.grey[700],
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
  }
})

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

const schemaWithTeamMembers = Joi.object({
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
  team: Joi.string().required(),
})

const schemaWithoutName = Joi.object({
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
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

export function CreateFolderForm({
  onErrorReceived,
  afterCreate,
  onCancel,
  _membersLabel,
}) {
  const { dispatch, _folders } = useStoreon('folders')
  const { teams } = useFetchOnce('teams')
  const c = useStyles()
  const [saveTeamActive, setSaveTeamActive] = useState(false)

  let saveLogo = teams.isSaved
    ? saveTeamSuccess
    : saveTeamActive
    ? saveTeamLogo
    : teamLogo
  let errors
  let teamNames = []

  if (teams.data) {
    teams.data.forEach(team => {
      teamNames.push(team.name)
    })
  }

  const validationResolver = data => {
    const members = data.members ? parseEmails(data.members) : []
    const input = {
      name: data.name,
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

  const {
    register,
    handleSubmit,
    getValues,
    triggerValidation,
    control,
    setValue,
  } = useForm({
    validationResolver,
    reValidateMode: 'onSubmit',
  })

  const isExistingTeam = () => {
    return teamNames.indexOf(getValues('members')) > -1
  }

  const handleSave = async (data, e) => {
    e.preventDefault()
    try {
      const variables = {
        name: data.name,
        members: data.members,
        team: data.team ? data.team : null,
      }

      // dispatch('create-folder', variables);
      const res = await api({
        method: 'POST',
        endpoint: 'folders',
        body: variables,
      })
      const folder = res.data
      afterCreate(folder)
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

  const addInputGroupField = () => {
    return (
      <>
        <label
          className={classnames(c.FolderForm_Label, c.FolderForm_TeamLabel)}
          htmlFor='team'
        >
          Team Name
        </label>
        <input className={c.FolderForm_FullWidthInput} name='team' ref={register()} />
      </>
    )
  }

  const addSaveGroupFields = () => {
    return (
      <>
        {saveTeamActive ? addInputGroupField() : null}
        <div className={classnames(c.FolderForm_Row, c.FolderForm_TeamRow)}>
          <img className={c.FolderForm_SaveLogo} src={saveLogo} />
          {saveTeamActive && !teams.isSaved ? (
            <label className={c.FolderForm_SaveTeamLabel} onClick={() => saveGroup()}>
              Save Team
            </label>
          ) : null}
          {!saveTeamActive && !teams.isSaved ? (
            <label
              className={c.FolderForm_SaveTeamLabel}
              onClick={() => saveGroupActivate()}
            >
              Save Users As Team
            </label>
          ) : null}
          {saveTeamActive && teams.isSaved ? (
            <label className={c.SaveTeamSuccessLabel}>Team Saved</label>
          ) : null}
        </div>
      </>
    )
  }

  const saveGroupActivate = () => {
    setSaveTeamActive(true)
  }

  const saveGroup = () => {
    initSchema = schemaWithTeamMembers
    triggerValidation()
    if (!(errors.members || errors.team)) {
      const data = {
        team: getValues('team'),
        members: getValues('members') ? parseEmails(getValues('members')) : [],
      }
      dispatch('add-team', data)
    }
    initSchema = schemaWithName
  }

  const onAutocompleteChange = event => {
    setValue('members', event.target?.value ? event.target.value : event[1])
    if (isExistingTeam()) {
      initSchema = autocompleteSchema
    } else {
      initSchema = schemaWithName
    }
    // triggerValidation()
  }

  return (
    <form className={c.FolderForm} onSubmit={handleSubmit(handleSave)}>
      <label className={c.FolderForm_Label} htmlFor='name'>
        Folder Name
      </label>
      <input
        className={c.FolderForm_FullWidthInput}
        name='name'
        ref={register({ required: true })}
      />
      <label className={c.FolderForm_Label} htmlFor='members'>
        Add users or enter an existing team name
      </label>
      <Controller
        as={
          <Autocomplete
            className={c.FolderForm_Row}
            options={teamNames}
            getOptionLabel={team => team}
            freeSolo
            ListboxProps={{
              style: { borderRadius: '3px', background: '#ececec', overflow: 'auto' },
            }}
            defaultValue=''
            renderInput={teams => (
              <Controller
                as={
                  <div className={c.FolderForm_PseudoForm} ref={teams.InputProps.ref}>
                    <input {...teams.inputProps} />
                  </div>
                }
                name='members'
                control={control}
              />
            )}
          />
        }
        name='members-autocomplete'
        control={control}
        onInputChange={event => onAutocompleteChange(event)}
        onChange={event => onAutocompleteChange(event)}
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
  const validationResolver = data => {
    const members = data.members ? parseEmails(data.members) : []
    const input = { members }

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
        Add Users
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
