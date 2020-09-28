import React, { useCallback } from 'react'
import { Button, Input, Textarea, Spinner, Spacer } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    EditModelForm: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '95%',
    },
    EditModelForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    EditModelForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
    },
    EditModelForm_DeleteButton: {
      width: '100%',
    },
    EditModelForm_Field: {
      display: 'flex',
      flexDirection: 'column',
    },
    EditModelForm_label: {
      margin: '.5rem 0',
    },
    EditModelForm_input: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      backgroundColor: theme.colors.white[400],
    },
    EditModelForm_textarea: {
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
const EditModelForm = ({
  model = {},
  isLoading,
  handleConfirm = noop,
  handleCancel = noop,
  handleDelete = noop,
  editProfileErrorMessage,
}) => {
  const c = useStyles()

  const initialState = {
    name: model.name || '',
    description: model.description || '',
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
      handleConfirm({
        id: model.id,
        name: data.name,
        description: data.description,
      })
    },
    [handleConfirm, model]
  )

  return (
    <form className={c.EditModelForm} onSubmit={onFormSubmit(handleSubmit)}>
      <Spacer size='1rem' />
      {editProfileErrorMessage && (
        <>
          <h4 className={c.Signin_ErrorText} data-cy='signup-error'>
            {editProfileErrorMessage}
          </h4>
          <Spacer size='1rem' />
        </>
      )}
      <Input
        id='model-name-input'
        autoComplete='off'
        name='name'
        label='Model Name'
        maxLength='150'
        value={inputState && inputState.name}
        onChange={handleOnInputChange}
        required
      />
      <Spacer size='1rem' />
      <Textarea
        id='model-description-input'
        autoComplete='off'
        name='description'
        label='Model Description'
        maxLength='150'
        value={inputState && inputState.description}
        onChange={handleOnInputChange}
        required
      />
      <Spacer size='2rem' />
      <div className={c.EditModelForm_ButtonContainer}>
        <Button secondary className={c.EditModelForm_Button} onClick={handleCancel}>
          Cancel
        </Button>
        <Spacer size={'1rem'} />
        <Button className={c.EditModelForm_Button} type='submit'>
          {isLoading ? (
            <div>
              <Spinner size={'1rem'} />
            </div>
          ) : (
            'Save'
          )}
        </Button>
      </div>
      <Spacer size='1rem' />
      <Button tertiary className={c.EditModelForm_DeleteButton} onClick={handleDelete}>
        <TrashCanIcon />
        <Spacer size={'.5rem'} />
        Delete Model
      </Button>
    </form>
  )
}

export default EditModelForm
