import React, { useCallback } from 'react'
import { useForm } from '@hooks'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import { Button, Spinner, TextInput } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(theme => {
  return {
    InviteForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    InviteForm_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    InviteForm_Row: {
      display: 'flex',
    },
    InviteForm_TeamRow: {
      alignItems: 'flex-end',
    },
    InviteForm_ButtonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '3rem',
    },
    InviteForm_SaveButton: {
      minWidth: '6.75rem',
    },
    InviteForm_Label: {
      marginBottom: '.5rem',
    },
    InviteForm_FullWidthInput: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '1.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      background: theme.colors.white[900],
    },
    InviteForm_ErrorText: {
      ...theme.mixins.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    InviteForm_SaveLogo: {
      margin: '26px 7px 0 auto',
    },
    InviteForm_SaveTeamLabel: {
      color: theme.colors.blue[500],
      cursor: 'pointer',
      marginTop: '1.625rem',
    },
    InviteForm_PseudoForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',

      '& input': {
        border: `1px solid ${theme.colors.grey[100]}`,
        padding: '.5rem 1rem',
        borderRadius: '.5rem',
        minWidth: 0,
        background: theme.colors.white[900],
        color: theme.variables.colors.textInput,
        '&:focus, &:active': {
          borderColor: theme.colors.gold[500],
        },
      },
    },
    InviteForm_MemberInput: {
      marginBottom: 0,
      width: '100%',
    },
  }
})

const schemaWithoutName = Joi.object({
  members: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .min(1)
    .required(),
  emails: Joi.any(),
})

const parseEmails = R.pipe(R.split(/[ ,] */), R.filter(R.identity))
const trimEmails = emails => emails.map(email => email.trim())

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

const DisplayInviteFormErrors = ({ errors, className, serverErrorMsg }) => {
  const c = useStyles()
  const messages = R.toPairs(errors)

  return messages.map((error, i) => {
    if (isEmptyMembers(error)) {
      return (
        <h4 className={classnames(className, c.InviteForm_ErrorText)} key={i}>
          Please invite at least one other member
        </h4>
      )
    } else if (isInvalidEmail(error)) {
      return (
        <h4 className={classnames(className, c.InviteForm_ErrorText)} key={i}>
          Please check that you have provided valid emails
        </h4>
      )
    } else if (isEmptyName(error)) {
      return (
        <h4 className={classnames(className, c.InviteForm_ErrorText)} key={i}>
          Please provide a name for your folder
        </h4>
      )
    } else if (isServerError(error)) {
      return (
        <h4 className={classnames(className, c.InviteForm_ErrorText)} key={i}>
          {serverErrorMsg}
        </h4>
      )
    } else {
      return null
    }
  })
}

const InviteUsersForm = ({ folderId, onErrorReceived, afterInvite }) => {
  const { dispatch, folders } = useStoreon('folders')
  const c = useStyles()

  const initialState = {
    members: [],
    emails: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: schemaWithoutName,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      if (key === 'emails') onInputChange('members', trimEmails([...parseEmails(value)]))
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleSave = useCallback(
    ({ members }, isValid, errors) => {
      if (!isValid) {
        return onErrorReceived(errors)
      }
      const variables = { emails: members }
      dispatch('invite-to-folder', {
        data: variables,
        folderId: folderId,
        onFinish: () => afterInvite(members),
        onError: error => {
          onErrorReceived({
            server: error,
          })
        },
      })
    },
    [afterInvite, dispatch, folderId, onErrorReceived]
  )

  return (
    <form className={c.InviteForm} onSubmit={onFormSubmit(handleSave)}>
      <label className={c.InviteForm_Label} htmlFor='members'>
        Add users by email
      </label>
      <TextInput
        className={c.InviteForm_FullWidthInput}
        name='emails'
        value={inputState && inputState['emails']}
        onChange={e => {
          handleOnInputChange('emails', e.target.value)
          onErrorReceived(null)
        }}
        placeholder='example@example.com'
      />
      <div className={classnames(c.InviteForm_Row, c.InviteForm_ButtonRow)}>
        <Button className={c.InviteForm_SaveButton} type='submit'>
          {folders && folders.isLoading ? (
            <Spinner className={c.InviteForm_Spinner} />
          ) : (
            'Invite'
          )}
        </Button>
      </div>
    </form>
  )
}

export { InviteUsersForm, DisplayInviteFormErrors }
