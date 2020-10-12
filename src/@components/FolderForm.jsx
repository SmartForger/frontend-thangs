import React, { useCallback } from 'react'
import { Button, Input, Spacer, Toggle } from '@components'
import { createUseStyles } from '@style'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    FolderForm: {
      width: '100%',
    },
    FolderForm_Wrapper: {
      width: '18.75rem',

      '& button': {
        width: '100%',
      },
    },
    FolderForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    FolderForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
    },
    FolderForm_Field: {
      display: 'flex',
      flexDirection: 'column',
    },
    FolderForm_label: {
      margin: '.5rem 0',
    },
    FolderForm_input: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      backgroundColor: theme.colors.white[400],
    },
    FolderForm_textarea: {
      resize: 'vertical',
      border: 0,
      marginBottom: '2rem',
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.colors.white[400],
    },
    FolderForm_ButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  }
})
const noop = () => null

const FolderForm = ({
  folder = {},
  rootFolder = {},
  handleSubmit = noop,
  handleCancel = noop,
  errorMessage,
}) => {
  const c = useStyles()
  const { id, name, is_public: isPublic } = folder
  const initialState = {
    id: id,
    name: name || '',
    isPublic: isPublic || false,
    root: rootFolder.id || undefined,
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
    <div className={c.FolderForm_Wrapper}>
      <form className={c.FolderForm} onSubmit={onFormSubmit(handleSubmit)}>
        {errorMessage && (
          <>
            <h4 className={c.EditFolder_ErrorText}>{errorMessage}</h4>
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
        <div className={c.FolderForm_ButtonContainer}>
          <Button
            secondary
            className={c.FolderForm_Button}
            onClick={handleCancel}
            type='button'
          >
            Cancel
          </Button>
          <Spacer size={'1rem'} />
          <Button className={c.FolderForm_Button} type='submit'>
            Save
          </Button>
        </div>
      </form>
      <Spacer size='2.5rem' />
    </div>
  )
}

export default FolderForm
