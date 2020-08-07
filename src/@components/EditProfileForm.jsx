import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as R from 'ramda'
import { Button } from '@components'
import * as GraphqlService from '@services/graphql-service'
import { logger } from '@utilities/logging'
import classnames from 'classnames'
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
const graphqlService = GraphqlService.getInstance()

const EditProfileForm = ({ user }) => {
  const { register, handleSubmit, errors } = useForm()
  const [updateUser] = graphqlService.useUpdateUser()
  const [currentState, setCurrentState] = useState('ready')
  const c = useStyles()

  const formSubmit = useCallback(
    async (data, e) => {
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
    },
    [updateUser, user]
  )

  const handleChange = useCallback(() => setCurrentState('ready'), [setCurrentState])

  const buttonText = useMemo(() => {
    switch (currentState) {
      case 'waiting':
        return 'Saving...'
      case 'saved':
        return 'Saved!'
      case 'error':
        return 'Error'
      default:
        return 'Save Changes'
    }
  }, [currentState])

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
          defaultValue={user && user.profile && user.profile.description}
          ref={register({ required: true })}
          placeholder='Add a bio...'
          rows={5}
        />
      </div>

      <div className={c.EditProfileForm_ButtonContainer}>
        <Button
          className={c.EditProfileForm_Button}
          type='submit'
          disabled={!R.empty(errors)}
        >
          {buttonText}
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
