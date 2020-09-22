import React, { useCallback, useState } from 'react'
import { useStoreon } from 'storeon/react'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import {
  Button,
  Divider,
  MetadataSecondary,
  MultiLineBodyText,
  Input,
  LabelText,
  TitleSecondary,
  TitleTertiary,
  SingleLineBodyText,
  Spacer,
} from '@components'
import { useForm, useGoogleLogin, useFacebookLogin } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as BackgroundSvg } from '@svg/overlay-background.svg'
import { ReactComponent as CheckIcon } from '@svg/icon-check.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as GoogleLogo } from '@svg/google-logo.svg'
import { ReactComponent as FacebookLogo } from '@svg/facebook-logo.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Signup: {
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',

      [md]: {
        alignItems: 'stretch',
        flexDirection: 'row',
      },

      '& > div': {
        alignItems: 'flex-start',

        [md]: {
          width: ({ showPromo }) => (showPromo ? '50%' : '100%'),
        },
      },
    },
    Signup_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    Signup_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    Signup_SignUpPromo: {
      backgroundColor: theme.colors.purple[900],
      color: theme.colors.white[300],
      position: 'relative',
    },
    Signup_SignUpPromoSection: {
      zIndex: 2,
      '& path': {
        fill: theme.colors.white[400],
      },
    },
    Signup_SignUpPromoText: {
      maxWidth: '16.875rem',
    },
    Signup_SignUpForm: {
      backgroundColor: theme.colors.white[300],
      borderRadius: '0 0 .5rem .5rem',
      [md]: {
        borderRadius: 0,
      },
    },
    Signup_FormWrapper: {
      width: '100%',
    },
    Signup_Form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    Signup_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    Signup_Button: {
      margin: 0,
      width: '100%',
    },
    Signup_HasAccount: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
      justifyContent: 'center',
    },
    Signup_HasAccountButton: {
      padding: '.5rem',
      color: theme.colors.blue[500],
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    Signup_TermsCheckbox: {
      display: 'flex',
      alignItems: 'center',

      '& p': {
        margin: '0',
      },

      '& a': {
        textDecoration: 'underline',
      },
    },
    Signup_MobileSpacer: {
      [md]: {
        display: 'none',
      },
    },
    Signup_PromoBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 'auto',
      zIndex: 0,
      [md]: {
        left: 'auto',
        right: 0,
      },
    },
    Signup_ExitButton: {
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      zIndex: 4,
      cursor: 'pointer',

      '& path': {
        fill: ({ showPromo }) =>
          showPromo ? theme.colors.white[400] : theme.colors.black[500],
      },
    },
    Signup_withGoogleButton: {
      border: `1px solid ${theme.colors.black[500]}`,
      backgroundColor: 'transparent',
      width: '100%',
    },
  }
})

const signUpSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
  registration_code: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
})

const SignUpPromo = ({ c, titleMessage }) => {
  return (
    <div className={classnames(c.Signup_Row, c.Signup_SignUpPromo)}>
      <Spacer size='4rem' />
      <div className={c.Signup_SignUpPromoSection}>
        <div>
          <Spacer size='4rem' />
          <TitleSecondary light>{titleMessage || 'Where Thangs happen.'}</TitleSecondary>
          <Spacer size='2rem' />
          <MultiLineBodyText light className={c.Signup_SignUpPromoText}>
            Join for free and experience one of the fastest growing modeling communities
            with collaboration, geometric searches, over 1 million free models and much
            more.
          </MultiLineBodyText>
          <Spacer size='2rem' />
          <div className={c.Signup_Column}>
            <div className={c.Signup_Row}>
              <CheckIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>No fee or subscription</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <CheckIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Unlimited free downloads</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <CheckIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Search over 1 million models</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <CheckIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Geometrical searches</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <CheckIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Collaborate on projects</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <CheckIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Version Control</MultiLineBodyText>
            </div>
          </div>
          <Spacer size='4rem' />
        </div>
      </div>
      <div className={c.Signup_PromoBackground}>
        <BackgroundSvg />
      </div>
      <Spacer size='4rem' />
    </div>
  )
}

const SignUpForm = ({ c, dispatch, handleSignInClick, showPromo, source }) => {
  const [waiting, setWaiting] = useState(false)
  const [signupErrorMessage, setSignupErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const { googleLoginUrl } = useGoogleLogin()
  const { facebookLoginUrl } = useFacebookLogin()
  const initialState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
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

  const validateEmail = useCallback(() => {
    if (!EmailValidator.validate(inputState.email)) {
      setInvalidFields(['email'])
      setSignupErrorMessage('Please enter a valid e-mail address')
      dispatch(types.SET_OVERLAY_DATA, {
        overlayData: {
          shake: true,
        },
      })
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }, [dispatch, inputState, setFieldToValid])

  const validatePasswords = useCallback(() => {
    if (inputState.confirmPass !== inputState.password) {
      setInvalidFields(['password'])
      setSignupErrorMessage('Please ensure that both passwords match')
      dispatch(types.SET_OVERLAY_DATA, {
        overlayData: {
          shake: true,
        },
      })
      return false
    } else {
      setFieldToValid('password')
      return true
    }
  }, [dispatch, inputState, setFieldToValid])

  const handleSignUp = useCallback(async () => {
    setWaiting(true)
    setSignupErrorMessage(null)
    if (!validateEmail()) return setWaiting(false)
    if (!validatePasswords()) return setWaiting(false)

    const { error } = await authenticationService.signup({
      email: inputState.email,
      password: inputState.password,
      firstName: inputState.firstName,
      lastName: inputState.lastName,
      username: inputState.username,
    })

    setWaiting(false)
    if (error) {
      dispatch(types.SET_OVERLAY_DATA, {
        overlayData: {
          shake: true,
        },
      })
      setSignupErrorMessage(error.message)
    } else {
      const { error: loginError } = await authenticationService.login({
        email: inputState.email,
        password: inputState.password,
      })
      if (loginError) return setSignupErrorMessage(error)
      pendo.track('Overlay Sign Up Success', { source })
      return (window.location.href = '/welcome')
    }
  }, [dispatch, inputState, source, validateEmail, validatePasswords])

  return (
    <div className={classnames(c.Signup_Row, c.Signup_SignUpForm)}>
      <Spacer size='4rem' />
      <div className={c.Signup_FormWrapper}>
        <Spacer size='4rem' />
        <TitleTertiary>{showPromo ? 'Sign Up For Free' : 'Create Account'}</TitleTertiary>
        <Spacer size='2rem' />
        <a href={googleLoginUrl}>
          <Button secondary className={c.Signup_withGoogleButton}>
            <GoogleLogo />
            <Spacer size={'.5rem'} />
            <LabelText>Sign up with Google</LabelText>
          </Button>
        </a>
        <Spacer size='.5rem' />
        <a href={facebookLoginUrl}>
          <Button secondary className={c.Signup_withGoogleButton}>
            <FacebookLogo />
            <Spacer size={'.5rem'} />
            <LabelText>Sign up with Facebook</LabelText>
          </Button>
        </a>
        <Divider spacing={'1.5rem'} />
        <form onSubmit={onFormSubmit(handleSignUp)} data-cy='signup-form'>
          {!!signupErrorMessage && (
            <>
              <h4 className={c.Signup_ErrorText} data-cy='signup-error'>
                {signupErrorMessage}
              </h4>
              <Spacer size='1rem' />
            </>
          )}
          <div className={c.Signup_Form}>
            <Input
              id='username-input'
              name='username'
              label='Username'
              maxLength='100'
              autoComplete='username'
              value={inputState && inputState.username}
              onChange={handleOnInputChange}
              required
            />
            <Spacer size='1rem' />
            <Input
              id='email-input'
              name='email'
              label='Email'
              maxLength='150'
              autoComplete='email'
              value={inputState && inputState.email}
              onChange={handleOnInputChange}
              validator={validateEmail}
              required
            />
            <Spacer size='1rem' />
            <Input
              id='password-input'
              name='password'
              label='Password'
              maxLength='150'
              type='password'
              autoComplete='new-password'
              value={inputState && inputState.password}
              onChange={handleOnInputChange}
              validator={validatePasswords}
              required
            />
            <Spacer size='1rem' />
            <Input
              id='confirm-password-input'
              name='confirmPass'
              label='Confirm Password'
              maxLength='150'
              type='password'
              autoComplete='new-password'
              value={inputState && inputState.confirmPass}
              onChange={handleOnInputChange}
              validator={validatePasswords}
              required
            />
            <Spacer size='1rem' />
          </div>
          <Spacer size='1rem' />
          <Button className={c.Signup_Button} type='submit' disabled={waiting}>
            {waiting ? 'Processing...' : 'Sign up'}
          </Button>
          <Spacer size='.75rem' />
          <MetadataSecondary>
            Click “Sign up” to agree to Thangs&apos;&nbsp;
            <a href='/terms_and_conditions' target='_blank'>
              terms and conditions
            </a>{' '}
            and acknowledge that Thangs&apos;&nbsp;
            <a href='/privacy_policy' target='_blank'>
              Privacy Policy
            </a>{' '}
            applies to you.
          </MetadataSecondary>
        </form>
        <Divider spacing={'1.5rem'} />
        <div className={c.Signup_HasAccount}>
          <SingleLineBodyText>Already a member?</SingleLineBodyText>
          <Button
            tertiary
            className={c.Signup_HasAccountButton}
            onClick={handleSignInClick}
          >
            Log In
          </Button>
        </div>
      </div>
      <Spacer size='4rem' />
    </div>
  )
}

const Signup = ({ titleMessage, showPromo = true, source }) => {
  const c = useStyles({ showPromo })
  const { dispatch } = useStoreon()
  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])
  const handleSignInClick = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'signIn',
      overlayData: {
        animateIn: true,
        windowed: true,
        showPromo: false,
      },
    })
  }, [dispatch])
  return (
    <div className={c.Signup}>
      <ExitIcon className={c.Signup_ExitButton} onClick={closeOverlay} />
      {showPromo && <SignUpPromo c={c} titleMessage={titleMessage} />}
      <SignUpForm
        c={c}
        dispatch={dispatch}
        handleSignInClick={handleSignInClick}
        showPromo={showPromo}
        source={source}
      />
      <Spacer className={c.Signup_MobileSpacer} size='4rem' />
    </div>
  )
}

export default Signup
