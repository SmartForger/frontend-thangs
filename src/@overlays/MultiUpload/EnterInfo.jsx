import React, { useCallback, useMemo, useEffect } from 'react'
import * as R from 'ramda'
import {
  Button,
  Spacer,
  TitleTertiary,
  ModelThumbnail,
  MetadataPrimary,
  Input,
  Textarea,
  Dropdown,
} from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { formatBytes } from '@utilities'
import { CATEGORIES } from '@constants/fileUpload'

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
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    EnterInfo_Thumbnail: {
      flex: 'none',
      width: '3.75rem',
      height: '3.75rem !important',
    },
    EnterInfo_ModelInfo: {
      '& h3': {
        wordBreak: 'break-all',
        lineHeight: '1rem',
      },
    },
  }
})
const noop = () => null
const EnterInfo = ({
  activeView,
  handleBack = noop,
  handleContinue = noop,
  handleUpdate = noop,
  uploadFiles,
}) => {
  const c = useStyles({})
  const activeId = Object.keys(uploadFiles)[activeView]
  const model = useMemo(() => uploadFiles[activeId], [activeId, uploadFiles])
  const folders = []
  const initialState = {
    name: model.name || '',
    description: '',
    folder: 'public',
    material: '',
    height: '',
    weight: '',
    category: '',
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
    data => {
      handleUpdate({ id: activeId, data })
      handleContinue()
    },
    [handleContinue, handleUpdate, activeId]
  )

  const selectedCategory = useMemo(() => {
    return R.find(R.propEq('value', model.category), CATEGORIES)
  }, [model])

  const usersFolders = useMemo(() => {
    return folders && folders.length
      ? folders.map(folder => ({ value: folder.id, label: folder.name }))
      : []
  }, [folders])

  const selectedFolder = useMemo(() => {
    return undefined
    // if (!inputState.folder) return undefined
    // const selectedFolderObj = folders.find(folder => folder.id === inputState.folder)
    // const selectedFolder = { value: inputState.folder, label: selectedFolderObj.name }
    // return selectedFolder
  }, [])

  useEffect(() => {
    handleOnInputChange('name', model.name)
  }, [handleOnInputChange, model])

  return (
    <>
      <div className={c.EnterInfo_Row}>
        <ModelThumbnail
          className={c.EnterInfo_Thumbnail}
          name={model}
          model={{ ...model, uploadedFile: model.newFileName }}
        />
        <Spacer size={'1rem'} />
        <div className={c.EnterInfo_ModelInfo}>
          <TitleTertiary>{model.name}</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MetadataPrimary>{formatBytes(model.size)}</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'1.5rem'} />
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
          />
          <Spacer size={'1rem'} />
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
          <Spacer size={'1rem'} />
        </div>
        {folders && folders.length ? (
          <div className={c.EnterInfo_Field}>
            <label
              className={classnames(c.EnterInfo_Label, c.EnterInfo_FolderLabel)}
              htmlFor='folder'
            >
              Add To Folder
            </label>
            <Dropdown
              className={c.EnterInfo_Select}
              name='folder'
              placeholder='Select folder'
              defaultValue={selectedFolder}
              options={[{ value: 'public', label: 'Public' }, ...usersFolders]}
              onChange={e => {
                if (e) handleOnInputChange('folder', e.value)
              }}
            />
            <Spacer size={'1rem'} />
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
          <Spacer size={'1rem'} />
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
            <Spacer size={'1rem'} />
          </div>
          <div className={c.EnterInfo_Field}>
            <Input
              className={c.EnterInfo_FullWidthInput}
              name='height'
              label='Height'
              maxLength='50'
              onChange={handleOnInputChange}
              value={inputState && inputState.height}
            />
            <Spacer size={'1rem'} />
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
        <div className={c.EnterInfo_ButtonWrapper}>
          <Button secondary onClick={handleBack} type='button'>
            Cancel
          </Button>
          <Spacer size={'1rem'} />
          <Button type='submit'>Continue</Button>
        </div>
      </form>
      <Spacer size={'1rem'} />
    </>
  )
}

export default EnterInfo
