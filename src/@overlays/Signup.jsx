import React, { useCallback, useEffect, useState } from 'react'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import {
  Button,
  Divider,
  FormError,
  Input,
  LabelText,
  MetadataSecondary,
  MultiLineBodyText,
  SingleLineBodyText,
  Spacer,
  TitleSecondary,
  TitleTertiary,
} from '@components'
import { useForm, useGoogleLogin, useFacebookLogin, useQuery } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as BackgroundSvg } from '@svg/overlay-background.svg'
import { ReactComponent as VersionControlIcon } from '@svg/icon-version-control.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'
import { ReactComponent as CollabIcon } from '@svg/icon-collaboration.svg'
import { ReactComponent as StorageIcon } from '@svg/icon-storage.svg'
import { ReactComponent as HeartIcon } from '@svg/icon-heart.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as GoogleLogo } from '@svg/google-logo.svg'
import { ReactComponent as FacebookLogo } from '@svg/facebook-logo.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { overlayview, track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Signup: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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
      borderRadius: 0,
      color: theme.colors.white[300],
      position: 'relative',
      flex: 'none',

      [md]: {
        borderRadius: '1rem 0 0 1rem',
      },
    },
    Signup_SignUpPromoSection: {
      width: '100%',
      zIndex: 2,

      [md]: {
        width: '21.75rem',
      },
    },
    Signup_SignUpPromoText: {
      maxWidth: '16.875rem',
    },
    Signup_SignUpForm: {
      backgroundColor: theme.colors.white[300],
      borderRadius: '0 0 1rem 1rem',
      [md]: {
        borderRadius: 0,
      },
    },
    Signup_Wrapper: {
      backgroundColor: theme.colors.white[300],
      [md]: {
        borderRadius: ({ showPromo }) => (showPromo ? '0 1rem 1rem 0' : '1rem'),
      },
    },
    Signup_FormWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        width: '21.75rem',
      },
    },
    Signup_Form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    Signup_Button: {
      margin: 0,
      width: '100%',
    },
    Signup_HasAccount: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2.5rem',
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

        [md]: {
          fill: `${theme.colors.black[500]} !important`,
        },
      },
    },
    Signup_withGoogleButton: {
      border: `1px solid ${theme.colors.black[500]} !important`,
      backgroundColor: 'transparent !important',
      width: '100%',
    },
    Signup_withFacebookButton: {
      border: '1px solid #3B5998 !important',
      backgroundColor: '#3B5998 !important',
      color: `${theme.colors.white[400]} !important`,
      width: '100%',
    },
    Search_Icon: {
      '& path': {
        fill: theme.colors.gold[500],
      },
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
              <SearchIcon className={c.Search_Icon} />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Geometric Search</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <StorageIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Unlimited storage</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <CollabIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Collaboration</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <HeartIcon />
              <Spacer size='.5rem' />
              <MultiLineBodyText light>Completely Free</MultiLineBodyText>
            </div>
            <Spacer size='.5rem' />
            <div className={c.Signup_Row}>
              <VersionControlIcon />
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

const SignUpForm = ({ c, setOverlayData, handleSignInClick, showPromo, source }) => {
  const [waiting, setWaiting] = useState(false)
  const [signupErrorMessage, setSignupErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const redirectUrl = useQuery('redirectUrl')
  const { googleLoginUrl } = useGoogleLogin({
    redirectUrl: redirectUrl || window.location.href,
  })
  const { facebookLoginUrl } = useFacebookLogin({
    redirectUrl: redirectUrl || window.location.href,
  })
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
      setOverlayData({
        shake: true,
      })
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }, [setOverlayData, inputState, setFieldToValid])

  const validatePasswords = useCallback(() => {
    if (inputState.confirmPass !== inputState.password) {
      setInvalidFields(['password'])
      setSignupErrorMessage('Please ensure that both passwords match')
      setOverlayData({
        shake: true,
      })
      return false
    } else {
      setFieldToValid('password')
      return true
    }
  }, [setOverlayData, inputState, setFieldToValid])

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
      setOverlayData({
        shake: true,
      })
      setSignupErrorMessage(error.message)
    } else {
      const { error: loginError } = await authenticationService.login({
        email: inputState.email,
        password: inputState.password,
      })
      if (loginError) return setSignupErrorMessage(error)
      track('Overlay Sign Up Success', { source })
      if (redirectUrl) return (window.location.href = redirectUrl)
      if (window.location.href.includes('sessionExpired'))
        return (window.location.href = '/')
      if (window.location.href.includes('authFailed')) return (window.location.href = '/')
      return (window.location.href = '/welcome')
    }
  }, [setOverlayData, inputState, redirectUrl, source, validateEmail, validatePasswords])

  return (
    <div className={classnames(c.Signup_Row, c.Signup_Wrapper)}>
      <Spacer size='3rem' />
      <div className={c.Signup_FormWrapper}>
        <Spacer size='4rem' />
        <TitleTertiary>{showPromo ? 'Sign Up For Free' : 'Create Account'}</TitleTertiary>
        <Spacer size='2rem' />
        <a
          href={googleLoginUrl}
          onClick={useCallback(
            () => track('Overlay Sign Up Click - Google', { source }),
            [source]
          )}
        >
          <Button secondary className={c.Signup_withGoogleButton}>
            <GoogleLogo />
            <Spacer size={'.5rem'} />
            <LabelText>Sign up with Google</LabelText>
          </Button>
        </a>
        <Spacer size='1rem' />
        <a
          href={facebookLoginUrl}
          onClick={useCallback(
            () => track('Overlay Sign Up Click - Facebook', { source }),
            [source]
          )}
        >
          <Button secondary className={c.Signup_withFacebookButton}>
            <FacebookLogo />
            <Spacer size={'.5rem'} />
            <LabelText>Sign up with Facebook</LabelText>
          </Button>
        </a>
        <Divider spacing={'1.5rem'} />
        <form onSubmit={onFormSubmit(handleSignUp)} data-cy='signup-form'>
          {!!signupErrorMessage && (
            <>
              <FormError>{signupErrorMessage}</FormError>
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
            <a href='/terms-and-conditions' target='_blank'>
              terms and conditions
            </a>{' '}
            and acknowledge that Thangs&apos;&nbsp;
            <a href='/privacy-policy' target='_blank'>
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
      <Spacer size='3rem' />
    </div>
  )
}

const Signup = ({ titleMessage, showPromo = false, source }) => {
  const c = useStyles({ showPromo })
  const { setOverlay, setOverlayData, setOverlayOpen } = useOverlay()

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleSignInClick = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'signIn',
      data: {
        animateIn: true,
        windowed: true,
        showPromo: false,
        smallWidth: true,
      },
    })
  }, [setOverlay])

  useEffect(() => {
    overlayview('Signup')
  }, [])

  return (
    <div className={c.Signup}>
      <ExitIcon className={c.Signup_ExitButton} onClick={closeOverlay} />
      {showPromo && <SignUpPromo c={c} titleMessage={titleMessage} />}
      <SignUpForm
        c={c}
        setOverlayData={setOverlayData}
        handleSignInClick={handleSignInClick}
        showPromo={showPromo}
        source={source}
      />
      <Spacer className={c.Signup_MobileSpacer} width='4rem' height='unset' />
    </div>
  )
}

export default Signup
