import React, { useCallback, useMemo, useState } from 'react'
import { Link, useHistory, useParams, useLocation } from 'react-router-dom'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import * as swearjar from '@utilities'
import { Button, Spinner, TextInput, Layout } from '@components'
import { useForm } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as UserRegistrationIcon } from '@svg/user-registration.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Signup: {
      margin: '0 auto',
      width: '90%',
      maxWidth: '32rem',
    },
    Signup_Spinner: {
      display: 'inline-block',
      width: '2rem',
    },
    Signup_PageHeader: {
      ...theme.text.darkPageTitleText,
      marginTop: '.5rem',
    },
    Signup_Field: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    Signup_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    Signup_TextInput: {
      width: '100%',
      marginTop: '.5rem',
    },
    Signup_FormControl: {
      marginTop: '2rem',
      width: '100%',
    },
    Signup_ButtonContainer: {
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',

      [md]: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
    },
    Signup_Button: {
      margin: 0,
    },
    Signup_ButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: '2rem',
      justifyContent: 'flex-end',
    },
    Signup_ButtonWrapper: {
      marginLeft: '1rem',
    },
    Signup_HasAccount: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    Signup_HasAccountButton: {
      padding: '.5rem',
      color: theme.colors.gold[500],
      fontWeight: 'bold',
    },
    Signup_TermsCheckbox: {
      display: 'flex',
      alignItems: 'center',

      '& p': {
        marginRight: '1rem',
      },
    },
  }
})

const signUpSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
  registration_code: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().required(),
})

const useQuery = location => {
  return new URLSearchParams(location.search)
}

const Page = () => {
  const location = useLocation()
  const query = useQuery(location)
  const redirectUrl = useMemo(() => query.get('redirectUrl'), [query])
  const inviteEmail = useMemo(() => query.get('email'), [query])
  const [waiting, setWaiting] = useState(false)
  const [signupErrorMessage, setSignupErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const c = useStyles()

  const initialState = {
    email: inviteEmail || '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
    acceptedTerms: false,
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: signUpSchema,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const history = useHistory()
  const { registrationCode } = useParams()

  const handleSignUp = useCallback(async () => {
    let requestedPage = localStorage.getItem('routeBeforeSignIn')
    localStorage.removeItem('routeBeforeSignIn')
    setWaiting(true)
    setSignupErrorMessage(null)

    const { error } = await authenticationService.signup({
      email: inputState.email,
      password: inputState.password,
      registrationCode: registrationCode,
      firstName: inputState.firstName,
      lastName: inputState.lastName,
      username: inputState.username,
    })

    setWaiting(false)
    if (error) {
      setSignupErrorMessage(error.message)
    } else {
      await authenticationService.login({
        email: inputState.email,
        password: inputState.password,
      })
      if (redirectUrl) return history.push(redirectUrl)
      requestedPage ? history.push(requestedPage) : history.push('/welcome')
      requestedPage = null
    }
  }, [history, inputState, redirectUrl, registrationCode])

  const setFieldToValid = useCallback(
    fieldName => {
      if (invalidFields.indexOf(fieldName) !== -1) {
        const temp = [...invalidFields]
        temp.splice(invalidFields.indexOf(fieldName), 1)
        setInvalidFields(temp)
        setSignupErrorMessage('')
      }
    },
    [invalidFields]
  )

  const validateUsername = useCallback(() => {
    if (swearjar.profane(inputState.username)) {
      setInvalidFields(['username'])
      setSignupErrorMessage('Sorry, we detected profanity in your username!')
      return false
    } else {
      setFieldToValid('username')
      return true
    }
  }, [inputState, setFieldToValid])

  const validateEmail = useCallback(() => {
    if (!EmailValidator.validate(inputState.email)) {
      setInvalidFields(['email'])
      setSignupErrorMessage('Please enter a valid e-mail address')
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }, [inputState, setFieldToValid])

  const validatePasswords = useCallback(() => {
    if (inputState.confirmPass !== inputState.password) {
      setInvalidFields(['password'])
      setSignupErrorMessage('Please ensure that both passwords match')
      return false
    } else {
      setFieldToValid('password')
      return true
    }
  }, [inputState, setFieldToValid])

  return (
    <div className={c.Signup}>
      <form onSubmit={onFormSubmit(handleSignUp)} data-cy='signup-form'>
        <UserRegistrationIcon />
        <h1 className={c.Signup_PageHeader}>
          Register {waiting && <Spinner className={c.Signup_Spinner} size='30' />}
        </h1>
        {!!signupErrorMessage && (
          <h4 className={c.Signup_ErrorText} data-cy='signup-error'>
            {signupErrorMessage}
          </h4>
        )}
        <div className={c.Signup_Field}>
          <div className={c.Signup_FormControl}>
            <label>
              First Name
              <TextInput
                className={c.Signup_TextInput}
                id='first-name-input'
                type='text'
                name='firstName'
                maxLength='30'
                onChange={e => handleOnInputChange('firstName', e.target.value)}
                value={(inputState && inputState.firstName) || ''}
                data-cy='signup-first-name'
              />
            </label>
          </div>
          <div className={c.Signup_FormControl}>
            <label>
              Last Name
              <TextInput
                className={c.Signup_TextInput}
                id='last-name-input'
                type='text'
                name='lastName'
                maxLength='150'
                onChange={e => handleOnInputChange('lastName', e.target.value)}
                value={(inputState && inputState.lastName) || ''}
                data-cy='signup-last-name'
              />
            </label>
          </div>
          <div className={c.Signup_FormControl}>
            <label>
              Username
              <TextInput
                className={c.Signup_TextInput}
                id='username-input'
                type='text'
                name='username'
                maxLength='100'
                onChange={e => handleOnInputChange('username', e.target.value)}
                validator={validateUsername}
                value={(inputState && inputState.username) || ''}
                data-cy='signup-username'
                required
              />
            </label>
          </div>
          <div className={c.Signup_FormControl}>
            <label>
              Email
              <TextInput
                className={c.Signup_TextInput}
                id='email-input'
                type='text'
                name='email'
                maxLength='150'
                onChange={e => handleOnInputChange('email', e.target.value)}
                validator={validateEmail}
                value={(inputState && inputState.email) || ''}
                data-cy='signup-email'
                required
              />
            </label>
          </div>
          <div className={c.Signup_FormControl}>
            <label>
              Password
              <TextInput
                className={c.Signup_TextInput}
                id='password-input'
                autoComplete='new-password'
                type='password'
                name='password'
                onChange={e => handleOnInputChange('password', e.target.value)}
                value={(inputState && inputState.password) || ''}
                data-cy='signup-password'
                required
              />
            </label>
          </div>
          <div className={c.Signup_FormControl}>
            <label>
              Confirm Password
              <TextInput
                className={c.Signup_TextInput}
                id='confirm-password-input'
                autoComplete='new-password'
                type='password'
                name='confirmPass'
                onChange={e => handleOnInputChange('confirmPass', e.target.value)}
                value={(inputState && inputState.confirmPass) || ''}
                validator={validatePasswords}
                data-cy='signup-confirm-password'
                required
              />
            </label>
          </div>
        </div>
        <div className={c.Signup_TermsCheckbox}>
          <p>
            By checking the box, you agree <br />
            to the{' '}
            <a href='/terms_and_conditions' target='_blank'>
              terms and conditions
            </a>{' '}
            of this site.*
          </p>
          <input
            type='checkbox'
            value='Accepted Terms and Conditions'
            checked={inputState.acceptedTerms}
            onChange={e => {
              handleOnInputChange('acceptedTerms', e.target.checked)
            }}
            required
          />
        </div>
        <div className={c.Signup_ButtonRow}>
          <div className={c.Signup_ButtonWrapper}>
            <Button className={c.Signup_Button} type='submit'>
              Submit
            </Button>
          </div>
        </div>
      </form>
      <div className={c.Signup_HasAccount}>
        <span>Already have an account?</span>
        <Link to={'/login'}>
          <Button className={c.Signup_HasAccountButton} text>
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  )
}

const Signup = () => {
  return (
    <Layout showSearch={false}>
      <Page />
    </Layout>
  )
}

export default Signup
