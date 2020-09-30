import React, { useCallback, useState } from 'react'
import {
  Button,
  Dropdown,
  Input,
  Textarea,
  TitleTertiary,
  Spacer,
  MultiLineBodyText,
} from '@components'
import { createUseStyles } from '@style'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    EditModelForm: {
      width: '100%',
    },
    EditModelForm_Wrapper: {
      width: '100%',
    },
    EditModelForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    EditModelForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
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
    EditModelForm_ButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  }
})
const noop = () => null
const CATEGORIES = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'home', label: 'Home' },
  { value: 'safety', label: 'Safety' },
  { value: 'characters', label: 'Characters' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'technology', label: 'Technology' },
  { value: 'hobbyist', label: 'Hobbyist' },
]

const EditModelForm = ({
  model = {},
  handleSubmit = noop,
  handleDelete = noop,
  editProfileErrorMessage,
}) => {
  const c = useStyles()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const initialState = {
    id: model.id,
    name: model.name || '',
    description: model.description || '',
    material: model.material || '',
    height: model.height || '',
    weight: model.weight || '',
    category: model.category || '',
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

  const handleDeleteModel = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    handleDelete()
  }, [handleDelete])

  return (
    <div className={c.EditModelForm_Wrapper}>
      {!showDeleteConfirm && (
        <>
          <Spacer size='4rem' />
          <TitleTertiary>Edit Model</TitleTertiary>
          <Spacer size='2rem' />
          <form
            className={c.EditModelForm}
            onSubmit={onFormSubmit(handleSubmit)}
            data-cy='edit-model-form'
          >
            {editProfileErrorMessage && (
              <>
                <h4 className={c.EditModel_ErrorText} data-cy='edit-model-error'>
                  {editProfileErrorMessage}
                </h4>
                <Spacer size='1rem' />
              </>
            )}
            <Input
              id='name-input'
              name='name'
              label='Name'
              maxLength='150'
              value={inputState && inputState.name}
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
            <Input
              id='material-input'
              name='material'
              label='Material'
              maxLength='150'
              type='material'
              value={inputState && inputState.material}
              onChange={handleOnInputChange}
            />
            <Spacer size='1rem' />
            <Input
              id='height-input'
              name='height'
              label='Height'
              maxLength='150'
              type='height'
              value={inputState && inputState.height}
              onChange={handleOnInputChange}
            />
            <Spacer size='1rem' />
            <Input
              id='weight-input'
              name='weight'
              label='Weight'
              maxLength='150'
              type='weight'
              value={inputState && inputState.weight}
              onChange={handleOnInputChange}
            />
            <Spacer size='1rem' />
            <Dropdown
              className={c.UploadForm_Select}
              name='category'
              placeholder='Select category'
              isClearable
              options={CATEGORIES}
              onChange={e => {
                if (e) handleOnInputChange('category', e.value)
              }}
            />
            <Spacer size='1rem' />
            <div className={c.EditModelForm_ButtonRow}>
              <Button
                tertiary
                className={c.EditModelForm_DeleteButton}
                onClick={handleDeleteModel}
                type='button'
              >
                Delete Model
              </Button>
              <Button type='submit'>Submit</Button>
            </div>
            <Spacer size='3rem' />
          </form>
        </>
      )}
      {showDeleteConfirm && (
        <>
          <TitleTertiary>Delete Model</TitleTertiary>
          <Spacer size='2rem' />
          <div>
            <MultiLineBodyText>
              Are you sure you want to delete <b>{model.name}</b>?
            </MultiLineBodyText>
            <Spacer className={c.EditModel_MobileSpacer} size='2rem' />
            <div className={c.EditModelForm_ButtonRow}>
              <Button secondary onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Spacer className={c.EditModel_MobileSpacer} size='1rem' />
              <Button onClick={handleConfirmDelete}>Confirm</Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EditModelForm
