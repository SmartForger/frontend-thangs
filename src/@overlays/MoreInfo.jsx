import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import Joi from '@hapi/joi'
import * as EmailValidator from 'email-validator'
import {
  Button,
  Divider,
  Input,
  MetadataSecondary,
  SingleLineBodyText,
  Spacer,
  TitleTertiary,
} from '@components'
import { useForm } from '@hooks'
import { authenticationService } from '@services'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    MoreInfo: {
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      height: '100%',

      [md]: {
        height: 'unset',
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
    MoreInfo_Column: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',

      [md]: {
        height: 'unset',
      },
    },
    MoreInfo_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',

      [md]: {
        height: 'unset',
      },
    },
    MoreInfo_SignUpForm: {
      backgroundColor: theme.colors.white[300],
      borderRadius: '0 0 1rem 1rem',
      [md]: {
        borderRadius: 0,
      },
    },
    MoreInfo_FormWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        height: 'unset',
      },
    },
    MoreInfo_Form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    MoreInfo_Button: {
      margin: 0,
      width: '100%',
    },
    MoreInfo_HasAccount: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2.5rem',
      justifyContent: 'center',
    },
    MoreInfo_HasAccountButton: {
      padding: '.5rem',
      color: theme.colors.blue[500],
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    MoreInfo_TermsCheckbox: {
      display: 'flex',
      alignItems: 'center',

      '& p': {
        margin: '0',
      },

      '& a': {
        textDecoration: 'underline',
      },
    },
    MoreInfo_MobileSpacer: {
      [md]: {
        display: 'none',
      },
    },
    MoreInfo_ExitButton: {
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
    MoreInfo_Message: {
      textAlign: 'left',
    },
  }
})

const moreInfoSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  username: Joi.string().required(),
})

const MoreInfoForm = ({ c, dispatch, handleSignInClick }) => {
  const [waiting, setWaiting] = useState(false)
  const [moreInfoErrorMessage, setMoreInfoErrorMessage] = useState(
    'Thank you for using SSO to sign up. We just need a little more information for your new account.'
  )
  const [invalidFields, setInvalidFields] = useState([])
  const showErrorMessage = useMemo(() => moreInfoErrorMessage, [moreInfoErrorMessage])
  const initialState = {
    email: '',
    username: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: moreInfoSchema,
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
        setMoreInfoErrorMessage('')
      }
    },
    [invalidFields]
  )

  const validateEmail = useCallback(() => {
    if (!EmailValidator.validate(inputState.email)) {
      setInvalidFields(['email'])
      setMoreInfoErrorMessage('Please enter a valid e-mail address')
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

  const handleUpdateEmail = useCallback(async () => {
    setWaiting(true)
    setMoreInfoErrorMessage(null)
    const currentUserId = authenticationService.getCurrentUserId()
    dispatch(types.UPDATE_USER, {
      id: currentUserId,
      user: { email: inputState.email },
      onError: error => {
        setMoreInfoErrorMessage(error)
        setWaiting(false)
      },
      onFinish: () => {
        dispatch(types.CLOSE_OVERLAY)
      },
    })
  }, [dispatch, inputState])

  return (
    <div className={classnames(c.MoreInfo_Row, c.MoreInfo_SignUpForm)}>
      <Spacer size='3rem' />
      <div className={c.MoreInfo_FormWrapper}>
        <Spacer size='4rem' />
        <TitleTertiary>{'Finish Registration'}</TitleTertiary>
        <Divider spacing={'1.5rem'} />
        <form onSubmit={onFormSubmit(handleUpdateEmail)}>
          {showErrorMessage && (
            <>
              <MetadataSecondary className={c.MoreInfo_Message}>
                {moreInfoErrorMessage}
              </MetadataSecondary>
              <Spacer size='1rem' />
            </>
          )}
          <div className={c.MoreInfo_Form}>
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
          </div>
          <Spacer size='1rem' />
          <Button className={c.MoreInfo_Button} type='submit' disabled={waiting}>
            {waiting ? 'Processing...' : 'Finish'}
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
        <div className={c.MoreInfo_HasAccount}>
          <SingleLineBodyText>Already a member?</SingleLineBodyText>
          <Button
            tertiary
            className={c.MoreInfo_HasAccountButton}
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

const MoreInfo = ({ source }) => {
  const c = useStyles({})
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

  useEffect(() => {
    overlayview('MoreInfo')
  }, [])

  return (
    <div className={c.MoreInfo}>
      <ExitIcon className={c.MoreInfo_ExitButton} onClick={closeOverlay} />
      <MoreInfoForm
        c={c}
        dispatch={dispatch}
        handleSignInClick={handleSignInClick}
        source={source}
      />
      <Spacer className={c.MoreInfo_MobileSpacer} size='4rem' />
    </div>
  )
}

export default MoreInfo
