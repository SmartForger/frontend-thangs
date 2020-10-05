import React, { useCallback } from 'react'
import { Button, FormError, Spinner, Spacer } from '@components'
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
      justifyContent: 'flex-end',
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
  }
})
const noop = () => null
const EditProfileForm = ({
  user = {},
  isLoading,
  handleUpdateProfile = noop,
  handleCancel = noop,
  editProfileErrorMessage,
}) => {
  const c = useStyles()

  const initialState = {
    username: user.username,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    description: (user.profile && user.profile.description) || '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
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

  return (
    <form className={c.EditProfileForm} onSubmit={onFormSubmit(handleSubmit)}>
      {editProfileErrorMessage && (
        <>
          <FormError>{editProfileErrorMessage}</FormError>
          <Spacer size='1rem' />
        </>
      )}
      <div className={c.EditProfileForm_Field}>
        <label className={c.EditProfileForm_label} htmlFor='username'>
          Username
        </label>
        <input
          className={c.EditProfileForm_input}
          name='Username'
          value={inputState && inputState.username}
          onChange={e => {
            handleOnInputChange('username', e.target.value)
          }}
          required
        />
      </div>
      <div className={c.EditProfileForm_Field}>
        <label className={c.EditProfileForm_label} htmlFor='firstName'>
          First Name
        </label>
        <input
          className={c.EditProfileForm_input}
          name='firstName'
          value={inputState && inputState.firstName}
          placeholder='Enter first name...'
          onChange={e => {
            handleOnInputChange('firstName', e.target.value)
          }}
          required
        />
      </div>
      <div className={c.EditProfileForm_Field} htmlFor='lastName'>
        <label className={c.EditProfileForm_label}>Last Name</label>
        <input
          className={c.EditProfileForm_input}
          name='lastName'
          value={inputState && inputState.lastName}
          placeholder='Enter last name...'
          onChange={e => {
            handleOnInputChange('lastName', e.target.value)
          }}
          required
        />
      </div>
      <div className={c.EditProfileForm_Field} htmlFor='description'>
        <label className={c.EditProfileForm_label}>About</label>
        <textarea
          className={c.EditProfileForm_textarea}
          name='description'
          value={inputState && inputState.description}
          placeholder='Add a bio...'
          onChange={e => {
            handleOnInputChange('description', e.target.value)
          }}
          rows={5}
        />
      </div>

      <div className={c.EditProfileForm_ButtonContainer}>
        <Button
          secondary
          className={c.EditProfileForm_Button}
          onClick={handleCancel}
          type='button'
        >
          Cancel
        </Button>
        <Spacer size={'1rem'} />
        <Button className={c.EditProfileForm_Button} type='submit'>
          {isLoading ? (
            <div>
              <Spinner size={'1rem'} />
            </div>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
