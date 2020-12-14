import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import Joi from '@hapi/joi'
import {
  Button,
  Divider,
  FormError,
  Input,
  LabelText,
  MetadataSecondary,
  SingleLineBodyText,
  Spacer,
  TitleTertiary,
} from '@components'
import { useForm, useGoogleLogin, useFacebookLogin, useQuery } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as GoogleLogo } from '@svg/google-logo.svg'
import { ReactComponent as FacebookLogo } from '@svg/facebook-logo.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import { overlayview } from '@utilities/analytics'

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
    Signin_SignUpPromo: {
      backgroundColor: theme.colors.purple[900],
      color: theme.colors.white[300],
      position: 'relative',
      flex: 'none',
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
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
      if (redirectUrl) return (window.location.href = redirectUrl)
      if (window.location.href.includes('sessionExpired'))
        return (window.location.href = '/')
      if (window.location.href.includes('authFailed')) return (window.location.href = '/')
      return window.location.reload()
    }
  }, [dispatch, inputState, redirectUrl])

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
          <a href='/terms-and-conditions' target='_blank'>
            terms and conditions
          </a>{' '}
          and acknowledge that Thangs&apos;&nbsp;
          <a href='/privacy-policy' target='_blank'>
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
        smallWidth: true,
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

  useEffect(() => {
    overlayview('Signin')
  }, [])

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
      <Spacer className={c.Signin_MobileSpacer} width='4rem' height='unset' />
    </div>
  )
}

export default Signin
