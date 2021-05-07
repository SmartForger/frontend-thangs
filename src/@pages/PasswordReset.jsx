import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as EmailValidator from 'email-validator'
import { authenticationService } from '@services'
import { useForm } from '@hooks'
import { TextInput, Spinner, Button, Layout } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { track, pageview } from '@utilities/analytics'
import { VALIDATION_EMAIL, VALIDATION_REQUIRED } from '@utilities/validation'

const useStyles = createUseStyles(theme => {
  return {
    PasswordReset: {
      margin: 'auto',
      marginTop: '6.5rem',
    },
    PasswordReset_PageHeader: {
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
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    PasswordReset_SuccessText: {
      ...theme.text.formSuccessText,
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

const resetSchema = {
  email: {
    label: 'Email',
    rules: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
  },
}

const changePasswordSchema = {
  password: {
    label: 'Password',
    rules: [VALIDATION_REQUIRED],
  },
  confirmPassword: {
    label: 'Confirm Password',
    rules: [VALIDATION_REQUIRED],
  },
}

const ServerErrors = ({ errors }) => {
  return typeof errors !== 'object' ? (
    errors
  ) : (
    <ul>
      {Object.entries(errors).flatMap(([errKey, msgList]) =>
        msgList.map((errorMessage, i) => <li key={`${errKey}-${i}`}>{errorMessage}</li>)
      )}
    </ul>
  )
}

const ResetPage = () => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const c = useStyles()

  useEffect(() => {
    pageview('PasswordReset')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleResetPassword = useCallback(
    async (_, isValid, errors) => {
      if (!isValid) {
        return setErrorMessage(errors?.[0]?.message)
      }

      setIsWaiting(true)
      setErrorMessage(null)
      setIsSuccess(false)

      try {
        await authenticationService.resetPasswordForEmail(inputState.email)
        setIsSuccess(true)
        const partialEmail = inputState.email.substring(0, 5)
        track('Password Reset Page - email requested', { email: partialEmail })
      } catch (e) {
        setErrorMessage(
          e?.response?.data ? (
            <ServerErrors errors={e.response.data} />
          ) : (
            'Unknown error. Try again.'
          )
        )
      } finally {
        setIsWaiting(false)
      }
    },
    [inputState]
  )

  return (
    <div className={c.PasswordReset}>
      <h1 className={c.PasswordReset_PageHeader}>
        Reset Password{' '}
        {isWaiting && <Spinner className={c.PasswordReset_Spinner} size='30' />}
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
                disabled={isWaiting}
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
  const [isWaiting, setIsWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()
  const { token } = useParams()
  const c = useStyles()

  useEffect(() => {
    pageview('PasswordResetConfirm')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    setIsWaiting(true)
    setErrorMessage(null)

    try {
      const { error } = await authenticationService.setPasswordForReset({
        ...inputState,
        token,
      })
      if (!error) {
        track('Password Reset Confirm - password reset success', { token })
        history.push('/')
      }
      track('Password Reset Confirm - password reset failed', { error })
    } catch (e) {
      track('Password Reset Confirm - password reset failed', { e })
      setErrorMessage(
        e && e.response && e.response.data ? (
          <ServerErrors errors={e.response.data} />
        ) : (
          'Unknown error. Try again.'
        )
      )
    } finally {
      setIsWaiting(false)
    }
  }, [history, inputState, token])

  return (
    <div className={c.PasswordReset}>
      <h1 className={c.PasswordReset_PageHeader}>
        Set New Password{' '}
        {isWaiting && <Spinner className={c.PasswordReset_Spinner} size='30' />}
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
                disabled={isWaiting}
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
                disabled={isWaiting}
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
