import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import * as swearjar from '@utilities'
import { Button, Spinner, TextInput, Layout } from '@components'
import { useForm } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as UserRegistrationIcon } from '@svg/user-registration.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Signup: {
      width: '31.25rem',
      margin: 'auto',
      marginTop: '6.5rem',
    },
    Signup_Spinner: {
      display: 'inline-block',
      width: '2rem',
    },
    Signup_PageHeader: {
      ...theme.mixins.text.darkPageTitleText,
      marginTop: '.5rem',
    },
    Signup_Field: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    Signup_ErrorText: {
      ...theme.mixins.text.formErrorText,
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    Signup_Button: {
      margin: 0,
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

const Page = () => {
  const [waiting, setWaiting] = useState(false)
  const [signupErrorMessage, setSignupErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const c = useStyles()

  const initialState = {
    email: '',
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
    setWaiting(true)
    setSignupErrorMessage(null)

    const response = await authenticationService.signup({
      email: inputState.email,
      password: inputState.password,
      registration_code: registrationCode,
      first_name: inputState.firstName,
      last_name: inputState.lastName,
      username: inputState.username,
    })

    setWaiting(false)
    if (response.status !== 201) {
      const fields = Object.keys(response.data)
      setInvalidFields(fields)
      setSignupErrorMessage(response.data[fields[0]])
    } else {
      await authenticationService.login({
        email: inputState.email,
        password: inputState.password,
      })
      history.push('/')
    }
  }, [history, inputState, registrationCode])

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

  const invalidForm = useMemo(() => {
    if (!registrationCode) {
      return false
    }
    if (
      inputState.acceptedTerms &&
      inputState.firstName &&
      inputState.lastName &&
      inputState.username &&
      inputState.email &&
      inputState.password &&
      inputState.password === inputState.confirmPass
    ) {
      return false
    }
    return true
  }, [inputState, registrationCode])

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
        <div className={c.Signup_ButtonContainer}>
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
          />
          <Button
            className={c.Signup_Button}
            type='submit'
            disabled={waiting || invalidForm}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export const Signup = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
