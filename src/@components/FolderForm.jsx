import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as R from 'ramda'
import { Button, Input, Spacer, Toggle } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { useForm } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    FolderForm: {
      width: '100%',
    },
    FolderForm_Wrapper: {
      '& button': {
        width: '100%',
      },
    },
    FolderForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'column-reverse',

      [md]: {
        flexDirection: 'unset',
      },
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
    FolderForm_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: '500',
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
  }
})
const noop = () => null
const getFolderName = fullFolderName => {
  return fullFolderName.split('//').reverse()[0]
}

const getParentName = fullFolderName => {
  return fullFolderName.split('//').slice(0, -1).join('//')
}

const FolderForm = ({
  folder = {}, //editing a folder
  parentFolder = {}, //creating a new subfolder
  handleSubmit = noop,
  handleCancel = noop,
  errorMessage,
}) => {
  const c = useStyles()
  const firstInputRef = useRef(null)
  const { id, name } = folder
  const isPublic = !R.isEmpty(parentFolder)
    ? parentFolder.isPublic
    : !R.isEmpty(folder)
    ? folder.isPublic
    : true
  const initialState = {
    id: id,
    name: name ? getFolderName(name) : '',
    isPublic: isPublic,
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

  const handleFolderSubmit = useCallback(
    data => {
      const newData = { ...data }
      if (!R.isEmpty(folder) && folder.root) {
        newData.name = `${getParentName(folder.name)}//${data.name}`
      } else if (!R.isEmpty(parentFolder)) {
        newData.name = `${parentFolder.name}//${data.name}`
      }
      newData.root = !R.isEmpty(parentFolder)
        ? parentFolder.root
          ? parentFolder.root
          : parentFolder.id
        : undefined
      handleSubmit(newData)
    },
    [folder, handleSubmit, parentFolder]
  )

  const privacyDisabledTooltip = useMemo(() => {
    if (!R.isEmpty(folder)) return 'Editing folder privacy not yet supported'
    if (!R.isEmpty(parentFolder)) return 'Folder privacy is inherited'
    return null
  }, [folder, parentFolder])

  useEffect(() => {
    firstInputRef.current.focus()
  }, [])

  return (
    <div className={c.FolderForm_Wrapper}>
      <form className={c.FolderForm} onSubmit={onFormSubmit(handleFolderSubmit)}>
        {errorMessage && (
          <>
            <h4 className={c.FolderForm_ErrorText}>{errorMessage}</h4>
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
          inputRef={firstInputRef}
        />
        <Spacer size='.5rem' />
        <Toggle
          id={'privacy_switch'}
          label={'Private Folder'}
          checked={inputState && !inputState.isPublic}
          onChange={handleOnToggleChange}
          disabled={!!privacyDisabledTooltip}
          hoverTooltip={privacyDisabledTooltip}
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
