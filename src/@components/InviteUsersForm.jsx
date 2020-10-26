import React, { useCallback } from 'react'
import { useForm } from '@hooks'
import Joi from '@hapi/joi'
import * as R from 'ramda'
import * as EmailValidator from 'email-validator'
import { Button, Spinner, TextInput, Spacer } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

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
      borderRadius: '.5rem',
      minWidth: 0,
      width: '100%',
      background: theme.colors.white[600],
    },
    InviteForm_ErrorText: {
      ...theme.text.formErrorText,
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
        background: theme.colors.white[600],
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
    InviteForm_LoaderScreen: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: 5,
      borderRadius: '1rem',
      display: 'flex',
    },
  }
})

const noop = () => null

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

const InviteUsersForm = ({
  folderId,
  onError = noop,
  afterAction = noop,
  errorMessage,
}) => {
  const { dispatch, folders = {} } = useStoreon('folders')
  const { isSaving } = folders
  const c = useStyles()

  const initialState = {
    members: [],
    emails: '',
  }

  const { onFormSubmit, onInputChange, inputState, clearAllInputs } = useForm({
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
      const emailValid = members.every(member => {
        return EmailValidator.validate(member)
      })
      if (!emailValid) return onError('Please enter valid e-mail addresses')
      if (!isValid) {
        return onError(errors)
      }
      const variables = { emails: members }
      dispatch(types.INVITE_TO_FOLDER, {
        data: variables,
        folderId: folderId,
        onFinish: () => {
          clearAllInputs()
          afterAction()
        },
        onError: error => {
          onError({
            server: error,
          })
        },
      })
    },
    [afterAction, clearAllInputs, dispatch, folderId, onError]
  )

  return (
    <>
      {isSaving && (
        <div className={c.InviteForm_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <form className={c.InviteForm} onSubmit={onFormSubmit(handleSave)}>
        {errorMessage && (
          <>
            <h4 className={c.InviteForm_ErrorText} data-cy='edit-folder-error'>
              {errorMessage}
            </h4>
            <Spacer size='1rem' />
          </>
        )}
        <div className={c.InviteForm_Row}>
          <TextInput
            className={c.InviteForm_FullWidthInput}
            name='emails'
            value={inputState && inputState['emails']}
            onChange={e => {
              handleOnInputChange('emails', e.target.value)
              onError(null)
            }}
            placeholder='Email'
          />
          <Spacer size={'.5rem'} />
          <Button className={c.InviteForm_SaveButton} type='submit'>
            Invite
          </Button>
        </div>
      </form>
    </>
  )
}

export { InviteUsersForm, DisplayInviteFormErrors }
