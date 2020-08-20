import React, { useState, useCallback, useMemo } from 'react'
import { useLocation, useHistory, Link } from 'react-router-dom'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import { authenticationService } from '@services'
import { useForm } from '@hooks'
import { TextInput, Spinner, Button, Layout, Flash } from '@components'
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg'
import { ReactComponent as LoginIcon } from '@svg/user-login.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Login: {},
    Login_PageHeader: {
      ...theme.mixins.text.darkPageTitleText,
      marginTop: '.5rem',
    },
    Login_Spinner: {
      display: 'inline-block',
      width: '2rem',
    },
    Login_TextInput: {
      width: '100%',
      marginTop: '.5rem',
    },
    Login_ErrorText: {
      ...theme.mixins.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    Login_Body: {
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
    },
    Login_FormControl: {
      marginTop: '2rem',
      width: '100%',
    },
    Login_ForgotText: {
      ...theme.mixins.text.darkFormText,
      marginTop: '1.5rem',
    },
    Login_Label: {
      ...theme.mixins.text.darkFormText,
    },
    Login_Background: {
      position: 'absolute',
      top: '2px',
      right: 0,
    },
    Login_Wrapper: {
      margin: '0 auto',
      maxWidth: '32rem',
      width: '90%',
    },
    Login_BackButton: {
      position: 'absolute',
      right: '10rem',
      top: '10rem',
    },
  }
})

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
})

const useQuery = location => {
  return new URLSearchParams(location.search)
}

const Page = () => {
  const [waiting, setWaiting] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const history = useHistory()
  const location = useLocation()
  const query = useQuery(location)
  const sessionExpired = useMemo(() => query.get('sessionExpired'), [query])
  const c = useStyles()
  const isFromThePortal = () =>
    history.location && history.location.state && history.location.state.prevPath

  const initialState = {
    email: '',
    password: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: loginSchema,
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
        setLoginErrorMessage('')
      }
    },
    [invalidFields]
  )

  const validateEmail = useCallback(() => {
    if (!EmailValidator.validate(inputState.email)) {
      setInvalidFields(['email'])
      setLoginErrorMessage('Please enter a valid e-mail address')
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }, [inputState, setFieldToValid])

  const handleLoginREST = useCallback(async () => {
    setWaiting(true)
    setLoginErrorMessage(null)

    const res = await authenticationService.restLogin({
      password: inputState.password,
    })

    setWaiting(false)

    if (res.status !== 200) {
      setLoginErrorMessage(
        res.data.detail || 'Sorry, we encounteed an unexpected error.  Please try again.'
      )
    } else {
      history.push('/')
    }
  }, [history, inputState])

  const handleLogin = useCallback(async () => {
    setWaiting(true)
    setLoginErrorMessage(null)

    const res = await authenticationService.login({
      email: inputState.email,
      password: inputState.password,
    })

    setWaiting(false)

    if (res.status !== 200) {
      setLoginErrorMessage(
        res.data.detail || 'Sorry, we encounteed an unexpected error.  Please try again.'
      )
    } else {
      await handleLoginREST()
      history.push('/')
    }
  }, [handleLoginREST, history, inputState])

  return (
    <Layout>
      <div className={c.Login_Wrapper}>
        {isFromThePortal() ? (
          <Button back className={c.Login_BackButton} onClick={() => history.goBack()}>
            <BackArrow />
          </Button>
        ) : null}
        <div className={c.Login_Body}>
          {sessionExpired && (
            <Flash>Session Expired. Please sign back in to continue.</Flash>
          )}
          <LoginIcon />
          <h1 className={c.Login_PageHeader}>
            Sign In {waiting && <Spinner className={c.Login_Spinner} size='30' />}
          </h1>
          {!!loginErrorMessage && (
            <h4 className={c.Login_ErrorText} data-cy='login-error'>
              {loginErrorMessage}
            </h4>
          )}
          <form onSubmit={onFormSubmit(handleLogin)} data-cy='login-form'>
            <div className={c.Login_Fields}>
              <div className={c.Login_FormControl}>
                <label className={c.Login_Label}>
                  E-Mail
                  <TextInput
                    className={c.Login_TextInput}
                    type='text'
                    name='email'
                    onChange={e => {
                      handleOnInputChange('email', e.target.value)
                    }}
                    validator={validateEmail}
                    value={inputState && inputState.email}
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
                    autoComplete='current-password'
                    onChange={e => {
                      handleOnInputChange('password', e.target.value)
                    }}
                    value={inputState && inputState.password}
                    data-cy='login-password'
                    required
                  />
                </label>
              </div>
            </div>
            <Button className={c.Login_Button} type='submit'>
              Sign In
            </Button>
          </form>
          <div className={c.Login_ForgotText}>
            Forgot password? <Link to='/password_reset'>Click here</Link> to reset your
            password.
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const Login = Page
