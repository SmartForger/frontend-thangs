import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as EmailValidator from 'email-validator'

import * as swearjar from '@utilities'
import { Button, Spinner, TextInput } from '@components'
import { NewSignupThemeLayout } from '@components/Layout'
import { useForm } from '@customHooks'
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

const Page = () => {
  const [waiting, setWaiting] = React.useState(false)
  const [signupErrorMessage, setSignupErrorMessage] = React.useState(null)
  const [invalidFields, setInvalidFields] = React.useState([])
  const { inputs, handleChange, handleSubmit } = useForm(signup)
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const c = useStyles()

  const history = useHistory()
  const { registrationCode } = useParams()

  async function signup() {
    setWaiting(true)
    setSignupErrorMessage(null)

    const response = await authenticationService.signup({
      email: inputs.email,
      password: inputs.password,
      registration_code: registrationCode,
      first_name: inputs.firstName,
      last_name: inputs.lastName,
      username: inputs.username,
    })

    setWaiting(false)
    if (response.status !== 201) {
      const fields = Object.keys(response.data)
      setInvalidFields(fields)
      setSignupErrorMessage(response.data[fields[0]])
    } else {
      await authenticationService.login({
        email: inputs.email,
        password: inputs.password,
      })
      history.push('/')
    }
  }

  const setFieldToValid = fieldName => {
    if (invalidFields.indexOf(fieldName) !== -1) {
      const temp = [...invalidFields]
      temp.splice(invalidFields.indexOf(fieldName), 1)
      setInvalidFields(temp)
      setSignupErrorMessage('')
    }
  }

  const needsCorrected = field => {
    if (invalidFields.indexOf(field) !== -1) return true
    return false
  }

  const invalidForm = () => {
    if (!registrationCode) {
      return false
    }
    if (
      acceptedTerms &&
      inputs.firstName &&
      inputs.lastName &&
      inputs.username &&
      inputs.email &&
      inputs.password &&
      inputs.password === inputs.confirmPass
    ) {
      return false
    }
    return true
  }

  const validateUsername = () => {
    if (swearjar.profane(inputs.username)) {
      setInvalidFields(['username'])
      setSignupErrorMessage('Sorry, we detected profanity in your username!')
      return false
    } else {
      setFieldToValid('username')
      return true
    }
  }

  const validateEmail = () => {
    if (!EmailValidator.validate(inputs.email)) {
      setInvalidFields(['email'])
      setSignupErrorMessage('Please enter a valid e-mail address')
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }

  const validatePasswords = () => {
    if (inputs.confirmPass !== inputs.password) {
      setInvalidFields(['password'])
      setSignupErrorMessage('Please ensure that both passwords match')
      return false
    } else {
      setFieldToValid('password')
      return true
    }
  }

  return (
    <div className={c.Signup}>
      <form onSubmit={handleSubmit} data-cy='signup-form'>
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
                onChange={handleChange}
                value={inputs.firstName || ''}
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
                onChange={handleChange}
                value={inputs.lastName || ''}
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
                incorrect={needsCorrected('username')}
                onChange={handleChange}
                validator={validateUsername}
                value={inputs.username || ''}
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
                incorrect={needsCorrected('email')}
                onChange={handleChange}
                validator={validateEmail}
                value={inputs.email || ''}
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
                onChange={handleChange}
                value={inputs.password || ''}
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
                onChange={handleChange}
                value={inputs.confirmPass || ''}
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
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
          />
          <Button
            className={c.Signup_Button}
            type='submit'
            disabled={waiting || invalidForm()}
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
    <NewSignupThemeLayout>
      <Page />
    </NewSignupThemeLayout>
  )
}
