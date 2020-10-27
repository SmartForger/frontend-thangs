import React, { useCallback } from 'react'
import { Button, FormError, Input, Spinner, Spacer, Textarea } from '@components'
import { createUseStyles } from '@style'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    EditProfileForm: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '32.5rem',
    },
    EditProfileForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
    EditProfileForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
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
      display: 'flex',
      flexDirection: 'row',
    },
    EditProfileForm_HalfWidthInput: {
      width: 'calc(50% - .5rem) !important',
    },
  }
})
const noop = () => null
const EditProfileForm = ({
  user = {},
  isLoading,
  handleUpdateProfile = noop,
  errorMessage,
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
          required
        />
        <Spacer size='1rem' />
        <Input
          id='lastName-input'
          name='lastName'
          label='Last Name'
          value={inputState && inputState.lastName}
          onChange={handleOnInputChange}
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
        required
      />
      <Spacer size='1rem' />
      <Textarea
        id='description-input'
        name='description'
        label='Description'
        type='description'
        value={inputState && inputState.description}
        onChange={handleOnInputChange}
        required
      />
      <Spacer size='1rem' />
      <div className={c.EditProfileForm_ButtonContainer}>
        <Button className={c.EditProfileForm_Button} type='submit'>
          {isLoading ? (
            <div>
              <Spinner size={'1rem'} />
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Spacer size={'1rem'} />
        <Button
          secondary
          className={c.EditProfileForm_Button}
          onClick={handleCancel}
          type='button'
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
