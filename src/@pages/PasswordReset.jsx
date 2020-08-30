import React, { useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import { authenticationService } from '@services'
import { useForm } from '@hooks'
import { TextInput, Spinner, Button, Layout } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    PasswordReset: {
      margin: 'auto',
      marginTop: '6.5rem',
    },
    PasswordReset_PageHeader: {
      ...theme.mixins.text.darkPageTitleText,
      marginTop: '.25rem',
    },
    PasswordReset_Spinner: {
      display: 'inline-block',
    },
    PasswordReset_TextInput: {
      width: '100%',
      marginTop: '.5rem',
    },
    PasswordReset_ErrorText: {
      ...theme.mixins.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    PasswordReset_SuccessText: {
      ...theme.mixins.text.formSuccessText,
      padding: '.25rem',
      borderRadius: '.25rem',
      marginTop: '.25rem',
    },
    PasswordReset_Fields: {
      width: '100%',
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
    },
    PasswordReset_Button: {
      display: 'block',
      margin: 0,
      marginTop: '2rem',
      float: 'right',
    },
    PasswordReset_FormControl: {
      marginTop: '2rem',
      width: '100%',
    },
  }
})

const resetSchema = Joi.object({
  email: Joi.string().required(),
})

const changePasswordSchema = Joi.object({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
})

const ServerErrors = ({ errors }) => (
  <ul>
    {Object.entries(errors).flatMap(([errKey, msgList]) =>
      msgList.map((errorMessage, i) => <li key={`${errKey}-${i}`}>{errorMessage}</li>)
    )}
  </ul>
)

const ResetPage = () => {
  const [waiting, setWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const c = useStyles()

  const initialState = {
    email: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: resetSchema,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const setFieldToValid = useCallback(
    fieldName => {
      if (invalidFields.indexOf(fieldName) !== -1) {
        const temp = [...invalidFields]
        temp.splice(invalidFields.indexOf(fieldName), 1)
        setInvalidFields(temp)
        setErrorMessage('')
      }
    },
    [invalidFields]
  )

  const validateEmail = useCallback(() => {
    if (!EmailValidator.validate(inputState.email)) {
      setInvalidFields(['email'])
      setErrorMessage('Please enter a valid e-mail address')
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }, [inputState, setFieldToValid])

  const handleResetPassword = useCallback(async () => {
    setWaiting(true)
    setErrorMessage(null)
    setIsSuccess(false)

    try {
      await authenticationService.resetPasswordForEmail(inputState.email)
      setIsSuccess(true)
    } catch (e) {
      setErrorMessage(
        e && e.response && e.response.data ? (
          <ServerErrors errors={e.response.data} />
        ) : (
          'Unknown error. Try again.'
        )
      )
    } finally {
      setWaiting(false)
    }
  }, [inputState])

  return (
    <div className={c.PasswordReset}>
      <h1 className={c.PasswordReset_PageHeader}>
        Reset Password{' '}
        {waiting && <Spinner className={c.PasswordReset_Spinner} size='30' />}
      </h1>
      {!!errorMessage && (
        <h4 className={c.PasswordReset_ErrorText} data-cy='reset-error'>
          {errorMessage}
        </h4>
      )}
      {!!isSuccess && (
        <h4 className={c.PasswordReset_SuccessText}>Email with reset link sent!</h4>
      )}
      <form onSubmit={onFormSubmit(handleResetPassword)} data-cy='reset-form'>
        <div className={c.PasswordReset_Fields}>
          <div className={c.PasswordReset_FormControl}>
            <label>
              Email
              <TextInput
                className={c.PasswordReset_TextInput}
                disabled={waiting}
                type='text'
                name='email'
                onChange={e => {
                  handleOnInputChange('email', e.target.value)
                }}
                validator={validateEmail}
                value={inputState && inputState.email}
                required
              />
            </label>
          </div>
        </div>
        <Button
          className={c.PasswordReset_Button}
          type='submit'
          disabled={!(inputState.email && EmailValidator.validate(inputState.email))}
        >
          {isSuccess ? 'Re-send Email' : 'Email Reset Link'}
        </Button>
      </form>
    </div>
  )
}

const ConfirmResetPage = () => {
  const [waiting, setWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()
  const { userId, token } = useParams()
  const c = useStyles()

  const initialState = {
    password: '',
    confirmPassword: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: changePasswordSchema,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleChangePassword = useCallback(async () => {
    setWaiting(true)
    setErrorMessage(null)

    try {
      await authenticationService.setPasswordForReset({
        ...inputState,
        token,
        userId,
      })

      history.push('/')
    } catch (e) {
      setErrorMessage(
        e && e.response && e.response.data ? (
          <ServerErrors errors={e.response.data} />
        ) : (
          'Unknown error. Try again.'
        )
      )
    } finally {
      setWaiting(false)
    }
  }, [history, inputState, token, userId])

  return (
    <div className={c.PasswordReset}>
      <h1 className={c.PasswordReset_PageHeader}>
        Set New Password{' '}
        {waiting && <Spinner className={c.PasswordReset_Spinner} size='30' />}
      </h1>
      {!!errorMessage && (
        <h4 className={c.PasswordReset_ErrorText} data-cy='confirm-reset-error'>
          {errorMessage}
        </h4>
      )}
      <form onSubmit={onFormSubmit(handleChangePassword)} data-cy='confirm-reset-form'>
        <div className={c.PasswordReset_Fields}>
          <div className={c.PasswordReset_FormControl}>
            <label>
              Password
              <TextInput
                className={c.PasswordReset_TextInput}
                disabled={waiting}
                type='password'
                name='password'
                autoComplete='new-password'
                onChange={e => {
                  handleOnInputChange('password', e.target.value)
                }}
                value={(inputState && inputState.password) || ''}
                required
              />
            </label>
          </div>
          <div className={c.PasswordReset_FormControl}>
            <label>
              Confirm Password
              <TextInput
                className={c.PasswordReset_TextInput}
                disabled={waiting}
                type='password'
                name='confirmPassword'
                autoComplete='new-password'
                onChange={e => {
                  handleOnInputChange('confirmPassword', e.target.value)
                }}
                value={(inputState && inputState.confirmPassword) || ''}
                required
              />
            </label>
          </div>
        </div>
        <Button
          className={c.PasswordReset_Button}
          type='submit'
          disabled={!(inputState.password && inputState.confirmPassword)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export const PasswordReset = () => {
  return (
    <Layout showSearch={false}>
      <ResetPage />
    </Layout>
  )
}

export const ConfirmPasswordReset = () => {
  return (
    <Layout showSearch={false}>
      <ConfirmResetPage />
    </Layout>
  )
}
