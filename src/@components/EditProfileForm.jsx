import React, { useCallback } from 'react'
import * as R from 'ramda'
import { Button, Spinner } from '@components'
import classnames from 'classnames'
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
      marginTop: '1rem',
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
      backgroundColor: theme.variables.colors.textInputBackground,
    },
    EditProfileForm_textareaContainer: {
      marginTop: '3rem',
    },
    EditProfileForm_textarea: {
      resize: 'vertical',
      border: 0,
      marginBottom: '2rem',
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.variables.colors.textInputBackground,
    },
  }
})
const noop = () => null
const EditProfileForm = ({ user, isLoading, handleUpdateProfile = noop }) => {
  const c = useStyles()

  const initialState = {
    firstName: user.firstName,
    emails: '',
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
    async (data, e) => {
      e.preventDefault()
      handleUpdateProfile({
        id: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        profile: {
          description: data.description,
        },
      })
    },
    [handleUpdateProfile, user]
  )

  return (
    <form
      className={c.EditProfileForm}
      onSubmit={(data, e) => onFormSubmit(handleSubmit)(data, e)}
    >
      <div className={c.EditProfileForm_Field}>
        <label className={c.EditProfileForm_label} htmlFor='firstName'>
          First Name
        </label>
        <input
          className={c.EditProfileForm_input}
          name='firstName'
          value={inputState.firstName}
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
          value={inputState.lastName}
          placeholder='Enter last name...'
          onChange={e => {
            handleOnInputChange('lastName', e.target.value)
          }}
          required
        />
      </div>
      <div
        className={classnames(
          c.EditProfileForm_Field,
          c.EditProfileForm_textareaContainer
        )}
        htmlFor='description'
      >
        <label className={c.EditProfileForm_label}>About</label>
        <textarea
          className={c.EditProfileForm_textarea}
          name='description'
          value={inputState.description}
          placeholder='Add a bio...'
          onChange={e => {
            handleOnInputChange('description', e.target.value)
          }}
          rows={5}
        />
      </div>

      <div className={c.EditProfileForm_ButtonContainer}>
        <Button className={c.EditProfileForm_Button} type='submit'>
          {isLoading ? <Spinner /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
