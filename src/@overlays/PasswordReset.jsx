import React, { useCallback, useEffect, useState } from 'react'
import { useStoreon } from 'storeon/react'
import Joi from '@hapi/joi'
import { Button, Input, TitleTertiary, Spacer } from '@components'
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
    PasswordReset: {
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
    PasswordReset_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    PasswordReset_ResetForm: {
      backgroundColor: theme.colors.white[300],
    },
    PasswordReset_FormWrapper: {
      width: '100%',
    },
    PasswordReset_Form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    PasswordReset_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
    PasswordReset_Button: {
      margin: 0,
      width: '100%',
    },
    PasswordReset_ExitButton: {
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      zIndex: 4,
      cursor: 'pointer',
      fill: theme.colors.black[500],
    },
  }
})

const emailSchema = Joi.object({
  email: Joi.string().required(),
})

const ResetForm = ({ c }) => {
  const [waiting, setWaiting] = useState(false)
  const [signupErrorMessage, setPasswordResetErrorMessage] = useState(null)
  const [signupSuccessMessage, setPasswordResetSuccessMessage] = useState(null)
  const initialState = {
    email: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: emailSchema,
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handlePasswordReset = useCallback(async () => {
    setWaiting(true)
    setPasswordResetErrorMessage(null)

    const { error } = await authenticationService.resetPasswordForEmail(inputState.email)

    setWaiting(false)
    if (error) {
      setPasswordResetErrorMessage(error.message)
    } else {
      setPasswordResetSuccessMessage('Email with reset link sent!')
    }
  }, [inputState])

  useEffect(() => {
    overlayview('PasswordReset')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classnames(c.PasswordReset_Row, c.PasswordReset_ResetForm)}>
      <Spacer size='3rem' />
      <div className={c.PasswordReset_FormWrapper}>
        <Spacer size='4rem' />
        <TitleTertiary>Reset Password</TitleTertiary>
        <Spacer size='2rem' />
        <form onSubmit={onFormSubmit(handlePasswordReset)} data-cy='signup-form'>
          {signupErrorMessage && (
            <>
              <h4 className={c.PasswordReset_ErrorText} data-cy='signup-error'>
                {signupErrorMessage}
              </h4>
              <Spacer size='1rem' />
            </>
          )}
          {signupSuccessMessage && (
            <>
              <h4 className={c.PasswordReset_SuccessText} data-cy='signup-success'>
                {signupSuccessMessage}
              </h4>
              <Spacer size='1rem' />
            </>
          )}
          <div className={c.PasswordReset_Form}>
            <Input
              id='email-input'
              name='email'
              label='Email'
              maxLength='150'
              autoComplete='email'
              value={inputState && inputState.email}
              onChange={handleOnInputChange}
              required
            />
            <Spacer size='1rem' />
          </div>
          <Button className={c.PasswordReset_Button} type='submit' disabled={waiting}>
            {waiting ? 'Processing...' : 'Send Email'}
          </Button>
        </form>
        <Spacer className={c.Signin_MobileSpacer} size='4rem' />
      </div>
      <Spacer size='3rem' />
    </div>
  )
}

const PasswordReset = () => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])
  return (
    <div className={c.PasswordReset}>
      <ExitIcon className={c.PasswordReset_ExitButton} onClick={closeOverlay} />
      <ResetForm c={c} />
    </div>
  )
}

export default PasswordReset
