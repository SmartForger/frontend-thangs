import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Body,
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
  Label,
} from '@physna/voxel-ui/@atoms/Typography'

import { Button, Divider, FormError, Input, Spacer } from '@components'
import { useForm, useGoogleLogin, useFacebookLogin, useQuery } from '@hooks'
import { authenticationService } from '@services'
import { overlayview } from '@utilities/analytics'
import { useOverlay } from '@hooks'

import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as GoogleLogo } from '@svg/google-logo.svg'
import { ReactComponent as FacebookLogo } from '@svg/facebook-logo.svg'
import { VALIDATION_REQUIRED, VALIDATION_EMAIL } from '@utilities/validation'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Signin: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      height: '100%',

      [md]: {
        borderRadius: '1rem',
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
    Signin_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    Signin_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',

      [md]: {
        borderRadius: '1rem',
      },
    },
    Signin_SignInForm: {
      backgroundColor: theme.colors.white[300],
      borderRadius: '0 0 1rem 1rem',

      [md]: {
        borderRadius: 0,
      },
    },
    Signin_FormWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        width: '21.75rem',
      },
    },
    Signin_Form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    Signin_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    Signin_Button: {
      margin: 0,
      width: '100%',
    },
    Signin_HasAccount: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2.5rem',
      justifyContent: 'center',
    },
    Signin_HasAccountButton: {
      padding: '.5rem',
      color: theme.colors.blue[500],
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    Signin_TermsCheckbox: {
      display: 'flex',
      alignItems: 'center',

      '& p': {
        margin: '0',
      },

      '& a': {
        textDecoration: 'underline',
      },
    },
    Signin_MobileSpacer: {
      [md]: {
        display: 'none',
      },
    },
    Signin_PromoBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 'auto',
      zIndex: '0',
      [md]: {
        left: 'auto',
        right: 0,
      },
    },
    Signin_ExitButton: {
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      zIndex: '4',
      cursor: 'pointer',

      '& path': {
        fill: theme.colors.black[500],
      },
    },
    Signin_withGoogleButton: {
      border: `1px solid ${theme.colors.black[500]} !important`,
      backgroundColor: 'transparent !important',
      width: '100%',
    },
    Signin_withFacebookButton: {
      border: '1px solid #3B5998 !important',
      backgroundColor: '#3B5998 !important',
      color: `${theme.colors.white[400]} !important`,
      width: '100%',
    },
    Signin_ResetPasswordButton: {
      width: '100%',
    },
  }
})

const signInSchema = {
  email: {
    label: 'Email',
    rules: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
  },
  password: {
    label: 'Password',
    rules: [VALIDATION_REQUIRED],
  },
}

export const SigninGoogleButton = () => {
  const c = useStyles({})

  return (
    <Button secondary className={c.Signin_withGoogleButton}>
      <GoogleLogo />
      <Spacer size={'.5rem'} />
      <Label>Log in with Google</Label>
    </Button>
  )
}

export const SigninFacebookButton = () => {
  const c = useStyles({})

  return (
    <Button secondary className={c.Signin_withFacebookButton}>
      <FacebookLogo />
      <Spacer size={'.5rem'} />
      <Label>Log in with Facebook</Label>
    </Button>
  )
}

const SignInForm = ({
  c,
  setOverlayData,
  handleSignUpClick,
  handleResetPasswordClick,
  sessionExpired,
  authFailed,
}) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [signinErrorMessage, setSigninErrorMessage] = useState(null)
  const showErrorMessage = useMemo(
    () => signinErrorMessage || sessionExpired || authFailed,
    [authFailed, sessionExpired, signinErrorMessage]
  )
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
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: signInSchema,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleSignIn = useCallback(
    async (_, isValid, errors) => {
      if (!isValid) {
        return setSigninErrorMessage(errors?.[0]?.message)
      }

      setIsWaiting(true)
      setSigninErrorMessage(null)

      const { error } = await authenticationService.login({
        email: inputState.email,
        password: inputState.password,
      })

      setIsWaiting(false)
      if (error) {
        setOverlayData({
          shake: true,
        })
        setSigninErrorMessage(error.data && error.data.message)
      } else {
        if (redirectUrl) return (window.location.href = redirectUrl)
        if (window.location.href.includes('sessionExpired'))
          return (window.location.href = '/')
        if (window.location.href.includes('authFailed'))
          return (window.location.href = '/')
        return window.location.reload()
      }
    },
    [setOverlayData, inputState, redirectUrl]
  )

  return (
    <div className={classnames(c.Signin_Row, c.Signin_SignInForm)}>
      <Spacer size='3rem' />
      <div className={c.Signin_FormWrapper}>
        <Spacer size='4rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Log in</Title>
        <Spacer size='2rem' />
        <a href={googleLoginUrl}>
          <SigninGoogleButton />
        </a>
        <Spacer size='1rem' />
        <a href={facebookLoginUrl}>
          <SigninFacebookButton />
        </a>
        <Divider spacing={'1.5rem'} />
        <form onSubmit={onFormSubmit(handleSignIn)}>
          {showErrorMessage && (
            <>
              <FormError>
                {authFailed
                  ? 'Something went wrong. Please try again'
                  : sessionExpired
                    ? 'Session Expired. Please sign back in to continue'
                    : signinErrorMessage}
              </FormError>
              <Spacer size='1rem' />
            </>
          )}
          <div className={c.Signin_Form}>
            <Input
              id='email-input'
              name='email'
              label='Email/Username'
              maxLength='150'
              autoComplete='email'
              value={inputState && inputState.email}
              onChange={handleOnInputChange}
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
            />
            <Spacer size='1rem' />
          </div>
          <Button className={c.Signin_Button} type='submit' disabled={isWaiting}>
            {isWaiting ? 'Processing...' : 'Log in'}
          </Button>
        </form>
        <Spacer size='.5rem' />
        <Button
          secondary
          className={c.Signin_ResetPasswordButton}
          onClick={handleResetPasswordClick}
        >
          Reset Password
        </Button>
        <Spacer size='1rem' />
        <Metadata type={MetadataType.secondary}>
          Click “Log in” to agree to Thangs&apos;&nbsp;
          <a href='/terms-and-conditions' target='_blank'>
            terms and conditions
          </a>{' '}
          and acknowledge that Thangs&apos;&nbsp;
          <a href='/privacy-policy' target='_blank'>
            Privacy Policy
          </a>{' '}
          applies to you.
        </Metadata>
        <Divider spacing={'1.5rem'} />
        <div className={c.Signin_HasAccount}>
          <Body>New to Thangs?</Body>
          <Button
            tertiary
            className={c.Signin_HasAccountButton}
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <Spacer size='3rem' />
    </div>
  )
}

const Signin = ({ sessionExpired, authFailed }) => {
  const c = useStyles({})
  const { setOverlay, setOverlayData, setOverlayOpen } = useOverlay()

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleSignUpClick = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'signUp',
      data: {
        animateIn: true,
        windowed: true,
        showPromo: false,
        smallWidth: true,
      },
    })
  }, [setOverlay])

  const handleResetPasswordClick = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'passwordReset',
      data: {
        animateIn: true,
        windowed: true,
        showPromo: false,
      },
    })
  }, [setOverlay])

  useEffect(() => {
    overlayview('Signin')
  }, [])

  return (
    <div className={c.Signin}>
      <ExitIcon className={c.Signin_ExitButton} onClick={closeOverlay} />
      <SignInForm
        c={c}
        setOverlayData={setOverlayData}
        handleSignUpClick={handleSignUpClick}
        handleResetPasswordClick={handleResetPasswordClick}
        sessionExpired={sessionExpired}
        authFailed={authFailed}
      />
      <Spacer className={c.Signin_MobileSpacer} width='4rem' height='unset' />
    </div>
  )
}

export default Signin
