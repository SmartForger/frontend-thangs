import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as R from 'ramda'
import { Button } from '@components/Button'
import * as GraphqlService from '@services/graphql-service'
import { logger } from '../logging'
import { createUseStyles } from '@style'

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
      padding: '.5rem 2.25rem',
      maxWidth: '100%',
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
    EditProfileForm_textarea: {
      resize: 'vertical',
      border: 0,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.variables.colors.textInputBackground,
    },
  }
})
const graphqlService = GraphqlService.getInstance()

export const EditProfileForm = ({ user }) => {
  const { register, handleSubmit, errors } = useForm()
  const [updateUser] = graphqlService.useUpdateUser()
  const [currentState, setCurrentState] = useState('ready')
  const c = useStyles()

  async function formSubmit(data, e) {
    e.preventDefault()

    const updateInput = {
      id: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      profile: {
        description: data.description,
      },
    }

    try {
      setCurrentState('waiting')
      await updateUser({
        variables: { updateInput },
      })
    } catch (error) {
      setCurrentState('error')
      logger.error('Error when trying to update the user', error)
    }
    setCurrentState('saved')
  }

  const handleChange = () => setCurrentState('ready')

  return (
    <form
      className={c.EditProfileForm}
      onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}
      onChange={handleChange}
    >
      <div className={c.EditProfileForm_Field}>
        <label className={c.EditProfileForm_label} htmlFor='firstName'>
          First Name
        </label>
        <input
          className={c.EditProfileForm_input}
          name='firstName'
          defaultValue={user.firstName}
          ref={register({ required: true })}
          placeholder='Enter first name...'
        />
      </div>
      <div className={c.EditProfileForm_Field} htmlFor='lastName'>
        <label className={c.EditProfileForm_label}>Last Name</label>
        <input
          className={c.EditProfileForm_input}
          name='lastName'
          defaultValue={user.lastName}
          ref={register({ required: true })}
          placeholder='Enter last name...'
        />
      </div>
      <div
        className={c.EditProfileForm_Field}
        htmlFor='description'
        css={`
          margin-top: 48px;
        `}
      >
        <label className={c.EditProfileForm_label}>About</label>
        <textarea
          className={c.EditProfileForm_textarea}
          name='description'
          defaultValue={user.profile.description}
          ref={register({ required: true })}
          placeholder='Add a bio...'
          rows={5}
          css={`
            margin-bottom: 32px;
          `}
        />
      </div>

      <div className={c.EditProfileForm_ButtonContainer}>
        <Button
          className={c.EditProfileForm_Button}
          type='submit'
          disabled={!R.empty(errors)}
          css={`
            width: 168px;
            padding: 8px 30px;
          `}
        >
          {currentState === 'waiting'
            ? 'Saving...'
            : currentState === 'saved'
            ? 'Saved!'
            : currentState === 'error'
            ? 'Error'
            : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
