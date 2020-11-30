import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as R from 'ramda'
import {
  Button,
  Dropdown,
  Input,
  MetadataPrimary,
  ModelThumbnail,
  Spacer,
  Textarea,
  Toggle,
  TitleTertiary,
} from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import { formatBytes } from '@utilities'
import { CATEGORIES } from '@constants/fileUpload'
import { overlayview, track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    EnterInfo: {
      width: '27.75rem',
      minHeight: '27.75rem',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    },
    EnterInfo_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
    },
    EnterInfo_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    EnterInfo_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
      background: 'white',
    },
    EnterInfo_UploadZone: {
      width: '100%',
      height: ({ hasFile }) => (hasFile ? '11rem' : '22.25rem'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '.75rem',
      border: '1px dashed #E5E5F3',

      '& h3': {
        lineHeight: '1.5rem',
      },

      '& > div': {
        height: '100%',
        outline: 'none',
      },
    },
    EnterInfo_UploadRow: {
      height: '100%',
    },
    EnterInfo_FileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    EnterInfo_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    EnterInfo_FieldRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    EnterInfo_Field: {
      marginBottom: '1rem',
    },
    EnterInfo_FileName: {
      textOverflow: 'ellipsis',
      width: '16rem',
      overflow: 'hidden',
      lineHeight: '1rem !important',
    },
    EnterInfo_Column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    EnterInfo_UploadColumn: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    EnterInfo_ScrollableFiles: {
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
      scrollbarColor: '#C7C7C7 white',
      height: '10.25rem',
      paddingTop: '.125rem',

      '&::-webkit-scrollbar': {
        width: '.75rem',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.white[600],
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: `3px solid ${theme.colors.white[600]}`,
      },
    },
    EnterInfo_RemoveBtn: {
      cursor: 'pointer',
      zIndex: 1,
    },
    EnterInfo_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    EnterInfo_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    EnterInfo_Thumbnail: {
      flex: 'none',
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      padding: '0px !important',
      width: '3.75rem',
      height: '3.75rem !important',
    },
    EnterInfo_ModelInfo: {
      '& h3': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '18rem',
        display: 'inline-block',
        lineHeight: '1rem',
      },
    },
    EnterInfo_PrivacyText: {
      width: '80%',
      textAlign: 'left !important',
    },
  }
})

const noop = () => null
const EnterInfo = ({
  activeStep,
  errorMessage = '',
  folderId,
  folders = {},
  isAssembly = false,
  handleContinue = noop,
  handleUpdate = noop,
  handleSkipToEnd = noop,
  setErrorMessage = noop,
  uploadFiles,
  isLoading,
}) => {
  const c = useStyles({})
  const firstInputRef = useRef(null)
  const activeId = Object.keys(uploadFiles)[activeStep]
  const model = useMemo(() => uploadFiles && uploadFiles[activeId], [
    activeId,
    uploadFiles,
  ])
  const [applyRemaing, setApplyRemaining] = useState(false)
  const initialState = {
    name: (model && model.name) || '',
    description: '',
    folderId: folderId || 'files',
    material: '',
    height: '',
    weight: '',
    category: '',
    isPublic: true,
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const folderPrivate = useMemo(() => {
    const folder = folders.find(folder => folder.id === inputState.folderId)
    return folder && !folder.isPublic
  }, [inputState, folders])

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
      setErrorMessage(null)
    },
    [onInputChange, setErrorMessage]
  )

  const handleSubmit = useCallback(
    data => {
      handleUpdate({ id: activeId, data })
      handleContinue({ selectedFolderId: inputState.folderId, step: activeStep + 1 })
    },
    [handleUpdate, activeId, handleContinue, inputState, activeStep]
  )

  const handleFolderChange = useCallback(
    e => {
      if (e) {
        handleOnInputChange('folderId', e.value)
        if (e.value !== 'files') {
          const folder = folders.find(folder => folder.id === e.value)
          if (!folder.isPublic) {
            handleOnInputChange('isPublic', false)
          }
        }
      }
    },
    [folders, handleOnInputChange]
  )

  const handleSkip = useCallback(() => {
    if (!inputState.name || inputState.name === '')
      return setErrorMessage('Model name is required')
    if (!inputState.description || inputState.description === '')
      return setErrorMessage('Model description is required')
    const filesLeft = Object.keys(uploadFiles).slice(activeStep)
    filesLeft.forEach(id => {
      const newData = { ...inputState }
      newData.name = uploadFiles[id].name
      handleUpdate({ id, data: newData })
    })
    track('Upload - Apply All')
    handleSkipToEnd({ selectedFolderId: inputState.folderId })
  }, [
    inputState,
    setErrorMessage,
    uploadFiles,
    activeStep,
    handleSkipToEnd,
    handleUpdate,
  ])

  const selectedCategory = useMemo(() => {
    if (!model) return undefined
    return R.find(R.propEq('value', model.category), CATEGORIES)
  }, [model])

  const selectedFolder = useMemo(() => {
    if (!folderId || folderId === 'files' || !folders || !folders.length)
      return { value: 'files', label: 'My Public Files' }
    const folder = folders.find(folder => folder.id.toString() === folderId.toString())
    if (folder && !folder.isPublic) {
      handleOnInputChange('isPublic', false)
    }
    return { value: folderId, label: folder.name.replace(new RegExp('//', 'g'), '/') }
  }, [folderId, folders, handleOnInputChange])

  const usersFolders = useMemo(() => {
    return folders && folders.length
      ? folders.map(folder => ({
          value: folder.id,
          label: folder.name.replace(new RegExp('//', 'g'), '/'),
        }))
      : []
  }, [folders])

  useEffect(() => {
    if (model) handleOnInputChange('name', model.name)
  }, [handleOnInputChange, model])

  useEffect(() => {
    if (folderPrivate) {
      handleOnInputChange('isPublic', false)
    }
  }, [folderPrivate, handleOnInputChange])

  if (!model) return null

  return (
    <>
      <div className={c.EnterInfo_Row}>
        <ModelThumbnail
          key={model.newFileName}
          className={c.EnterInfo_Thumbnail}
          name={model}
          model={{ ...model, uploadedFile: model.newFileName }}
        />
        <Spacer size={'1rem'} />
        <div className={c.EnterInfo_ModelInfo}>
          <TitleTertiary title={model.name}>{model.name}</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MetadataPrimary>{formatBytes(model.size)}</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'1.5rem'} />
      {errorMessage && (
        <>
          <h4 className={c.EnterInfo_ErrorText}>{errorMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      <form onSubmit={onFormSubmit(handleSubmit)}>
        <div className={c.EnterInfo_Field}>
          <Input
            className={c.EnterInfo_FullWidthInput}
            name='name'
            label='Name *'
            maxLength='100'
            onChange={handleOnInputChange}
            value={inputState && inputState.name}
            required
            inputRef={firstInputRef}
          />
        </div>
        <div className={c.EnterInfo_Field}>
          <Textarea
            id='description-input'
            name='description'
            label='Description *'
            type='description'
            value={inputState && inputState.description}
            onChange={handleOnInputChange}
            required
          />
        </div>
        {!isAssembly && folders && folders.length ? (
          <div className={c.EnterInfo_Field}>
            <Dropdown
              className={c.EnterInfo_Select}
              name='folder'
              placeholder={'Select folder'}
              defaultValue={selectedFolder}
              options={[{ value: 'files', label: 'My Public Files' }, ...usersFolders]}
              onChange={handleFolderChange}
            />
          </div>
        ) : null}
        <div className={c.EnterInfo_Field}>
          <Input
            className={c.EnterInfo_FullWidthInput}
            name='material'
            label='Material'
            maxLength='50'
            onChange={handleOnInputChange}
            value={inputState && inputState.material}
          />
        </div>
        <div className={c.EnterInfo_FieldRow}>
          <div className={c.EnterInfo_Field}>
            <Input
              className={c.EnterInfo_FullWidthInput}
              name='weight'
              label='Weight'
              maxLength='50'
              onChange={handleOnInputChange}
              value={inputState && inputState.weight}
            />
          </div>
          <Spacer size={'1rem'} />
          <div className={c.EnterInfo_Field}>
            <Input
              className={c.EnterInfo_FullWidthInput}
              name='height'
              label='Height'
              maxLength='50'
              onChange={handleOnInputChange}
              value={inputState && inputState.height}
            />
          </div>
        </div>
        <div className={c.EnterInfo_Field}>
          <Dropdown
            className={c.EnterInfo_Select}
            name='category'
            placeholder='Select category'
            defaultValue={selectedCategory}
            isClearable
            options={CATEGORIES}
            onChange={e => {
              if (e) handleOnInputChange('category', e.value)
            }}
          />
        </div>
        <Spacer size={'.5rem'} />
        <Toggle
          name='applyRemaining'
          label='Apply info to remaining models'
          checked={applyRemaing}
          onChange={ev => setApplyRemaining(ev.target.checked)}
        />
        <Toggle
          name='isPrivate'
          label='Make model private'
          disabled={folderPrivate}
          checked={!inputState.isPublic}
          onChange={ev => {
            handleOnInputChange('isPublic', !ev.target.checked)
          }}
        />
        <Spacer size={'1rem'} />
        <div className={c.EnterInfo_ButtonWrapper}>
          <Button type='submit' disabled={isLoading}>
            Continue
          </Button>
        </div>
      </form>
      <Spacer size={'2rem'} />
    </>
  )
}

export default EnterInfo
