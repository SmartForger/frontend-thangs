import React, { useCallback } from 'react'
import { Button, FormError, Input, Spacer, Textarea } from '@components'
import { createUseStyles } from '@physna/voxel-ui'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    EditProfileForm: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '36.125rem',
    },
    EditProfileForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      '& > *:last-child': {
        marginLeft: '1rem',
      },
    },
    EditProfileForm_Button: {
      width: '100%',
      [md]: {
        width: 'unset',
      },
    },
    EditProfileForm_Field: {
      display: 'flex',
      flexDirection: 'column',
    },
    EditProfileForm_label: {
      margin: '.5rem 0',
    },
    EditProfileForm_input: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      backgroundColor: theme.colors.white[400],
    },
    EditProfileForm_textarea: {
      resize: 'vertical',
      border: 0,
      marginBottom: '2rem',
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.colors.white[400],
    },
    EditProfileForm_Row: {
      display: 'block',
      [md]: {
        display: 'flex',
        flexDirection: 'row',
      },
    },
    EditProfileForm_HalfWidthInput: {
      [md]: {
        width: 'calc(50% - .5rem) !important',
      },
    },
  }
})
const noop = () => null
const EditProfileForm = ({
  user = {},
  handleUpdateProfile = noop,
  errorMessage,
  disabled,
}) => {
  const c = useStyles()

  const initialState = {
    username: user.username,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    description: (user.profile && user.profile.description) || '',
  }

  const { onFormSubmit, onInputChange, inputState, resetForm } = useForm({
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleSubmit = useCallback(
    async data => {
      handleUpdateProfile({
        id: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        profile: {
          description: data.description || '',
        },
      })
    },
    [handleUpdateProfile, user]
  )

  const handleCancel = useCallback(() => {
    resetForm()
  }, [resetForm])

  return (
    <form className={c.EditProfileForm} onSubmit={onFormSubmit(handleSubmit)}>
      {errorMessage && (
        <>
          <FormError>{errorMessage}</FormError>
          <Spacer size='1rem' />
        </>
      )}
      <div className={c.EditProfileForm_Row}>
        <Input
          id='firstName-input'
          name='firstName'
          label='First Name'
          value={inputState && inputState.firstName}
          onChange={handleOnInputChange}
          disabled={disabled}
          required
        />
        <Spacer size='1rem' />
        <Input
          id='lastName-input'
          name='lastName'
          label='Last Name'
          value={inputState && inputState.lastName}
          onChange={handleOnInputChange}
          disabled={disabled}
          required
        />
      </div>
      <Spacer size='1rem' />
      <Input
        id='username-input'
        className={c.EditProfileForm_HalfWidthInput}
        name='username'
        label='Username'
        value={inputState && inputState.username}
        onChange={handleOnInputChange}
        disabled={disabled}
        required
      />
      <Spacer size='1rem' />
      <Textarea
        id='description-input'
        name='description'
        label='Biography'
        type='description'
        value={inputState && inputState.description}
        onChange={handleOnInputChange}
        disabled={disabled}
        required
      />
      <Spacer size='1rem' />
      <div className={c.EditProfileForm_ButtonContainer}>
        <Button className={c.EditProfileForm_Button} type='submit' disabled={disabled}>
          Save Changes
        </Button>
        <Button
          secondary
          className={c.EditProfileForm_Button}
          onClick={handleCancel}
          type='button'
          disabled={disabled}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
