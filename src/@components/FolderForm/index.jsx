import React from 'react'
import { useForm } from 'react-hook-form'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import { Button } from '../Button'
import { Spinner } from '../Spinner'
import { useCreateFolder, useInviteToFolder } from '../../@customHooks/Folders'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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
  }
})

const schemaWithName = Joi.object({
  name: Joi.string().required(),
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
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
    }

    return null
  })
}

export const CreateFolderForm = ({
  onErrorReceived,
  afterCreate,
  onCancel,
  _membersLabel,
}) => {
  const c = useStyles()
  const validationResolver = data => {
    const members = data.members ? parseEmails(data.members) : []
    const input = {
      name: data.name,
      members,
    }

    const { error, value: values } = schemaWithName.validate(input)

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

  const [createFolder, { loading }] = useCreateFolder()

  const handleSave = async (data, e) => {
    e.preventDefault()
    try {
      const variables = { name: data.name, members: data.members }
      const mutation = await createFolder({
        variables,
      })
      const folder = mutation.data.createFolder.folder
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
          dark
          className={c.FolderForm_CancelButton}
          onClick={handleCancel}
          type='button'
        >
          Cancel
        </Button>
        <Button className={c.FolderForm_SaveButton} type='submit' disabled={loading}>
          {loading ? <Spinner className={c.FolderForm_Spinner} /> : 'Save'}
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
