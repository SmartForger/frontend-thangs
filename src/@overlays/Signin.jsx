import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import Joi from '@hapi/joi'
import {
  Button,
  Divider,
  Input,
  LabelText,
  TitleTertiary,
  SingleLineBodyText,
  Spacer,
  MetadataSecondary,
} from '@components'
import { useForm, useGoogleLogin, useFacebookLogin } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as GoogleLogo } from '@svg/google-logo.svg'
import { ReactComponent as FacebookLogo } from '@svg/facebook-logo.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Signin: {
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
    Signin_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    Signin_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    Signin_SignUpPromo: {
      backgroundColor: theme.colors.purple[900],
      color: theme.colors.white[300],
      position: 'relative',
    },
    Signin_SignUpPromoSection: {
      zIndex: 2,
      '& path': {
        fill: theme.colors.white[400],
      },
    },
    Signin_SignUpPromoText: {
      maxWidth: '16.875rem',
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
      zIndex: 0,
      [md]: {
        left: 'auto',
        right: 0,
      },
    },
    Signin_ExitButton: {
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      zIndex: 4,
      cursor: 'pointer',

      '& path': {
        fill: theme.colors.black[500],
      },
    },
    Signin_withGoogleButton: {
      border: `1px solid ${theme.colors.black[500]}`,
      backgroundColor: 'transparent',
      width: '100%',
    },
    Signin_withFacebookButton: {
      border: '1px solid #3B5998',
      backgroundColor: '#3B5998',
      color: theme.colors.white[400],
      width: '100%',
    },
    Signin_ResetPasswordButton: {
      width: '100%',
    },
  }
})

const signInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

const SignInForm = ({
  c,
  dispatch,
  handleSignUpClick,
  handleResetPasswordClick,
  sessionExpired,
  authFailed,
}) => {
  const [waiting, setWaiting] = useState(false)
  const [signupErrorMessage, setSigninErrorMessage] = useState(null)
  const showErrorMessage = useMemo(
    () => signupErrorMessage || sessionExpired || authFailed,
    [authFailed, sessionExpired, signupErrorMessage]
  )
  const { googleLoginUrl } = useGoogleLogin({ redirectUrl: window.location.href })
  const { facebookLoginUrl } = useFacebookLogin({ redirectUrl: window.location.href })
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

  const handleSignIn = useCallback(async () => {
    setWaiting(true)
    setSigninErrorMessage(null)

    const { error } = await authenticationService.login({
      email: inputState.email,
      password: inputState.password,
    })

    setWaiting(false)
    if (error) {
      dispatch(types.SET_OVERLAY_DATA, {
        overlayData: {
          shake: true,
        },
      })
      setSigninErrorMessage(error.data && error.data.message)
    } else {
      return window.location.reload()
    }
  }, [dispatch, inputState])

  return (
    <div className={classnames(c.Signin_Row, c.Signin_SignInForm)}>
      <Spacer size='3rem' />
      <div className={c.Signin_FormWrapper}>
        <Spacer size='4rem' />
        <TitleTertiary>Log in</TitleTertiary>
        <Spacer size='2rem' />
        <a href={googleLoginUrl}>
          <Button secondary className={c.Signin_withGoogleButton}>
            <GoogleLogo />
            <Spacer size={'.5rem'} />
            <LabelText>Log in with Google</LabelText>
          </Button>
        </a>
        <Spacer size='1rem' />
        <a href={facebookLoginUrl}>
          <Button secondary className={c.Signin_withFacebookButton}>
            <FacebookLogo />
            <Spacer size={'.5rem'} />
            <LabelText>Log in with Facebook</LabelText>
          </Button>
        </a>
        <Divider spacing={'1.5rem'} />
        <form onSubmit={onFormSubmit(handleSignIn)} data-cy='signup-form'>
          {showErrorMessage && (
            <>
              <h4 className={c.Signin_ErrorText} data-cy='signup-error'>
                {authFailed
                  ? 'Something went wrong. Please try again'
                  : sessionExpired
                  ? 'Session Expired. Please sign back in to continue'
                  : signupErrorMessage}
              </h4>
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
              required
            />
            <Spacer size='1rem' />
          </div>
          <Button className={c.Signin_Button} type='submit' disabled={waiting}>
            {waiting ? 'Processing...' : 'Log in'}
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
        <MetadataSecondary>
          Click “Log in” to agree to Thangs&apos;&nbsp;
          <a href='/terms_and_conditions' target='_blank'>
            terms and conditions
          </a>{' '}
          and acknowledge that Thangs&apos;&nbsp;
          <a href='/privacy_policy' target='_blank'>
            Privacy Policy
          </a>{' '}
          applies to you.
        </MetadataSecondary>
        <Divider spacing={'1.5rem'} />
        <div className={c.Signin_HasAccount}>
          <SingleLineBodyText>New to Thangs?</SingleLineBodyText>
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
  const { dispatch } = useStoreon()
  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])
  const handleSignUpClick = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'signUp',
      overlayData: {
        animateIn: true,
        windowed: true,
        showPromo: false,
      },
    })
  }, [dispatch])
  const handleResetPasswordClick = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'passwordReset',
      overlayData: {
        animateIn: true,
        windowed: true,
        showPromo: false,
      },
    })
  }, [dispatch])
  return (
    <div className={c.Signin}>
      <ExitIcon className={c.Signin_ExitButton} onClick={closeOverlay} />
      <SignInForm
        c={c}
        dispatch={dispatch}
        handleSignUpClick={handleSignUpClick}
        handleResetPasswordClick={handleResetPasswordClick}
        sessionExpired={sessionExpired}
        authFailed={authFailed}
      />
      <Spacer className={c.Signin_MobileSpacer} size='4rem' />
    </div>
  )
}

export default Signin
