import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as EmailValidator from 'email-validator'
import { authenticationService } from '@services'
import { useForm } from '@customHooks'
import { TextInput, Spinner, Button } from '@components'
import { NewSignupThemeLayout } from '@components/Layout'
import { darkPageTitleText, formSuccessText, formErrorText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    PasswordReset: {
      width: '31.25rem',
      margin: 'auto',
      marginTop: '6.5rem',
    },
    PasswordReset_PageHeader: {
      ...darkPageTitleText,
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
      ...formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    PasswordReset_SuccessText: {
      ...formSuccessText,
      backgroundColor: 'lightgreen',
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
      maxWidth: '9.75rem',
    },
    PasswordReset_FormControl: {
      marginTop: '2rem',
      width: '100%',
    },
  }
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
  const { inputs, handleChange, handleSubmit } = useForm(resetPassword)
  const [invalidFields, setInvalidFields] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const c = useStyles()

  const setFieldToValid = fieldName => {
    if (invalidFields.indexOf(fieldName) !== -1) {
      const temp = [...invalidFields]
      temp.splice(invalidFields.indexOf(fieldName), 1)
      setInvalidFields(temp)
      setErrorMessage('')
    }
  }
  const validateEmail = () => {
    if (!EmailValidator.validate(inputs.email)) {
      setInvalidFields(['email'])
      setErrorMessage('Please enter a valid e-mail address')
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }

  const needsCorrected = field => {
    if (invalidFields.indexOf(field) !== -1) return true
    return false
  }

  async function resetPassword() {
    setWaiting(true)
    setErrorMessage(null)
    setIsSuccess(false)

    try {
      await authenticationService.resetPasswordForEmail(inputs.email)
      setIsSuccess(true)
    } catch (e) {
      setErrorMessage(
        e?.response?.data ? (
          <ServerErrors errors={e.response.data} />
        ) : (
          'Unknown error. Try again.'
        )
      )
    } finally {
      setWaiting(false)
    }
  }

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
      <form onSubmit={handleSubmit} data-cy='reset-form'>
        <div className={c.PasswordReset_Fields}>
          <div className={c.PasswordReset_FormControl}>
            <label>
              E-Mail
              <TextInput
                className={c.PasswordReset_TextInput}
                disabled={waiting}
                type='text'
                name='email'
                incorrect={needsCorrected('email')}
                onChange={handleChange}
                validator={validateEmail}
                value={inputs.email}
                required
              />
            </label>
          </div>
        </div>
        <Button
          className={c.PasswordReset_Button}
          type='submit'
          disabled={!(inputs.email && EmailValidator.validate(inputs.email))}
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
  const { inputs, handleChange, handleSubmit } = useForm(resetPassword)
  const history = useHistory()
  const { userId, token } = useParams()
  const c = useStyles()

  async function resetPassword() {
    setWaiting(true)
    setErrorMessage(null)

    try {
      await authenticationService.setPasswordForReset({
        ...inputs,
        token,
        userId,
      })

      history.push('/')
    } catch (e) {
      setErrorMessage(
        e?.response?.data ? (
          <ServerErrors errors={e.response.data} />
        ) : (
          'Unknown error. Try again.'
        )
      )
    } finally {
      setWaiting(false)
    }
  }

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
      <form onSubmit={handleSubmit} data-cy='confirm-reset-form'>
        <div className={c.PasswordReset_Fields}>
          <div className={c.PasswordReset_FormControl}>
            <label>
              Password
              <TextInput
                className={c.PasswordReset_TextInput}
                disabled={waiting}
                type='password'
                name='password'
                onChange={handleChange}
                value={inputs.password || ''}
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
                onChange={handleChange}
                value={inputs.confirmPassword || ''}
                required
              />
            </label>
          </div>
        </div>
        <Button
          className={c.PasswordReset_Button}
          type='submit'
          disabled={!(inputs.password && inputs.confirmPassword)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export const PasswordReset = () => {
  return (
    <NewSignupThemeLayout>
      <ResetPage />
    </NewSignupThemeLayout>
  )
}

export const ConfirmPasswordReset = () => {
  return (
    <NewSignupThemeLayout>
      <ConfirmResetPage />
    </NewSignupThemeLayout>
  )
}
