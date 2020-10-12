import React, { useCallback } from 'react'
import {
  Button,
  Input,
  MultiLineBodyText,
  Spacer,
  TitleTertiary,
  Toggle,
} from '@components'
import { createUseStyles } from '@style'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    EditFolderForm: {
      width: '100%',
    },
    EditFolderForm_Wrapper: {
      width: '18.75rem',

      '& button': {
        width: '100%',
      },
    },
    EditFolderForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    EditFolderForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
    },
    EditFolderForm_Field: {
      display: 'flex',
      flexDirection: 'column',
    },
    EditFolderForm_label: {
      margin: '.5rem 0',
    },
    EditFolderForm_input: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      backgroundColor: theme.colors.white[400],
    },
    EditFolderForm_textarea: {
      resize: 'vertical',
      border: 0,
      marginBottom: '2rem',
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.colors.white[400],
    },
    EditFolderForm_ButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  }
})
const noop = () => null

const EditFolderForm = ({
  folder = {},
  handleSubmit = noop,
  handleCancel = noop,
  editProfileErrorMessage,
}) => {
  const c = useStyles()
  const { id, name, is_public: isPublic } = folder
  const initialState = {
    id: id,
    name: name || '',
    isPublic: isPublic || false,
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

  const handleOnToggleChange = useCallback(
    e => {
      onInputChange('isPublic', e && e.target && !e.target.checked)
    },
    [onInputChange]
  )

  return (
    <div className={c.EditFolderForm_Wrapper}>
      <Spacer size='4rem' />
      <TitleTertiary>Edit Folder</TitleTertiary>
      <Spacer size='1rem' />
      <MultiLineBodyText>
        Change the name or privacy settings of your folder.
      </MultiLineBodyText>
      <Spacer size='1rem' />
      <form
        className={c.EditFolderForm}
        onSubmit={onFormSubmit(handleSubmit)}
        data-cy='edit-folder-form'
      >
        {editProfileErrorMessage && (
          <>
            <h4 className={c.EditFolder_ErrorText} data-cy='edit-folder-error'>
              {editProfileErrorMessage}
            </h4>
            <Spacer size='1rem' />
          </>
        )}
        <Input
          id='name-input'
          name='name'
          label='Folder Name'
          maxLength='150'
          value={inputState && inputState.name}
          onChange={handleOnInputChange}
          required
        />
        <Spacer size='.5rem' />
        <Toggle
          id={'privacy_switch'}
          label={'Private Folder'}
          checked={inputState && !inputState.isPublic}
          onChange={handleOnToggleChange}
          disabled={true}
          hoverTooltip={'Folder privacy control coming soon'}
        />
        <Spacer size={'1rem'} />
        <div className={c.EditFolderForm_ButtonContainer}>
          <Button
            secondary
            className={c.EditFolderForm_Button}
            onClick={handleCancel}
            type='button'
          >
            Cancel
          </Button>
          <Spacer size={'1rem'} />
          <Button className={c.EditFolderForm_Button} type='submit'>
            Save
          </Button>
        </div>
      </form>
      <Spacer size='2.5rem' />
    </div>
  )
}

export default EditFolderForm
