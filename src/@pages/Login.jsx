import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import * as EmailValidator from 'email-validator'
import { authenticationService } from '@services'
import { useForm } from '@customHooks'
import { TextInput, Spinner, Button } from '@components'
import { NewSignupThemeLayout } from '@components/Layout'
import { ReactComponent as LoginIcon } from '@svg/user-login.svg'
import { darkPageTitleText, formErrorText, darkFormText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Login: {},
    Login_PageHeader: {
      ...darkPageTitleText,
      marginTop: '.5rem',
    },
    Login_Spinner: {
      display: 'inline-block',
    },
    Login_TextInput: {
      width: '100%',
      marginTop: '.5rem',
    },
    Login_ErrorText: {
      ...formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    Login_Body: {
      width: '31.25rem',
      margin: 'auto',
      marginTop: '6.5rem',
    },
    Login_Fields: {
      width: '100%',
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
    },
    Login_Button: {
      margin: 0,
      marginTop: '6rem',
      float: 'right',
      width: '6.5rem',
    },
    Login_FormControl: {
      marginTop: '2rem',
      width: '100%',
    },
    Login_ForgotText: {
      ...darkFormText,
      marginTop: '1.5rem',
    },
    Login_Label: {
      ...darkFormText,
    },
  }
})

const Page = () => {
  const [waiting, setWaiting] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState(null)
  const { inputs, handleChange, handleSubmit } = useForm(login)
  const [invalidFields, setInvalidFields] = useState([])
  const history = useHistory()
  const c = useStyles()

  const setFieldToValid = fieldName => {
    if (invalidFields.indexOf(fieldName) !== -1) {
      const temp = [...invalidFields]
      temp.splice(invalidFields.indexOf(fieldName), 1)
      setInvalidFields(temp)
      setLoginErrorMessage('')
    }
  }
  const validateEmail = () => {
    if (!EmailValidator.validate(inputs.email)) {
      setInvalidFields(['email'])
      setLoginErrorMessage('Please enter a valid e-mail address')
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

  async function login() {
    setWaiting(true)
    setLoginErrorMessage(null)

    const res = await authenticationService.login({
      email: inputs.email,
      password: inputs.password,
    })

    setWaiting(false)

    if (res.status !== 200) {
      setLoginErrorMessage(
        res.data.detail || 'Sorry, we encounteed an unexpected error.  Please try again.'
      )
    } else {
      history.push('/')
    }
  }

  const invalidForm = () => {
    if (inputs.password && inputs.email && EmailValidator.validate(inputs.email)) {
      return false
    }
    return true
  }

  return (
    <NewSignupThemeLayout>
      <div className={c.Login_Body}>
        <LoginIcon />
        <h1 className={c.Login_PageHeader}>
          Sign In {waiting && <Spinner className={c.Login_Spinner} size='30' />}
        </h1>
        {!!loginErrorMessage && (
          <h4 className={c.Login_ErrorText} data-cy='login-error'>
            {loginErrorMessage}
          </h4>
        )}
        <form onSubmit={handleSubmit} data-cy='login-form'>
          <div className={c.Login_Fields}>
            <div className={c.Login_FormControl}>
              <label className={c.Login_Label}>
                E-Mail
                <TextInput
                  className={c.Login_TextInput}
                  type='text'
                  name='email'
                  incorrect={needsCorrected('email')}
                  onChange={handleChange}
                  validator={validateEmail}
                  value={inputs.email}
                  data-cy='login-email'
                  required
                />
              </label>
            </div>
            <div className={c.Login_FormControl}>
              <label className={c.Login_Label}>
                Password
                <TextInput
                  className={c.Login_TextInput}
                  type='password'
                  name='password'
                  onChange={handleChange}
                  value={inputs.password}
                  data-cy='login-password'
                  required
                />
              </label>
            </div>
          </div>
          <Button
            className={c.Login_Button}
            type='submit'
            disabled={waiting || invalidForm()}
          >
            Sign In
          </Button>
        </form>
        <div className={c.Login_ForgotText}>
          Forgot password? <Link to='/password_reset'>Click here</Link> to reset your
          password.
        </div>
      </div>
    </NewSignupThemeLayout>
  )
}

export const Login = Page
