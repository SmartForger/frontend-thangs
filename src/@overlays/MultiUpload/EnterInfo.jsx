import React, { useCallback, useMemo, useRef, useState } from 'react'
import * as R from 'ramda'
import Joi from '@hapi/joi'
import {
  Button,
  Dropdown,
  Input,
  MetadataPrimary,
  MetadataSecondary,
  ModelThumbnail,
  SingleLineBodyText,
  Spacer,
  Textarea,
  Toggle,
  TitleTertiary,
} from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import { formatBytes } from '@utilities'
import { CATEGORIES } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    EnterInfo: {
      minHeight: '27.75rem',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',

      [md]: {
        width: '27.75rem',
      },
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
      alignItems: 'center',
    },
    EnterInfo_Field: {
      marginBottom: '1rem',
      flexGrow: 1,
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
        display: 'inline-block',
        lineHeight: '1rem',

        [md]: {
          width: '18rem',
        },
      },
    },
    EnterInfo_PrivacyText: {
      width: '80%',
      textAlign: 'left !important',
    },
  }
})

const noop = () => null

const enterInfoSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  material: Joi.string().allow(''),
  height: Joi.string().allow(''),
  weight: Joi.string().allow(''),
  category: Joi.string().allow(''),
  folderId: Joi.string().allow(''),
})

const EnterInfo = props => {
  const {
    activeStep,
    errorMessage = '',
    folderId,
    folders = {},
    isAssembly = false,
    handleContinue = noop,
    handleUpdate = noop,
    setErrorMessage = noop,
    uploadFiles,
    isLoading,
  } = props
  const c = useStyles({})
  const firstInputRef = useRef(null)
  const activeId = Object.keys(uploadFiles)[activeStep]
  const model = useMemo(() => uploadFiles && uploadFiles[activeId], [
    activeId,
    uploadFiles,
  ])
  const [applyRemaining, setApplyRemaining] = useState(false)
  const initialState = {
    name: (model && model.name) || '',
    description: '',
    folderId: folderId || 'files',
    material: '',
    height: '',
    weight: '',
    category: '',
  }

  const { checkError, onFormSubmit, onInputChange, inputState } = useForm({
    initialValidationSchema: enterInfoSchema,
    initialState,
  })

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
      handleContinue({ applyRemaining, data })
    },
    [handleUpdate, activeId, handleContinue, applyRemaining]
  )

  const selectedCategory = useMemo(() => {
    if (!inputState) return null
    return R.find(R.propEq('value', inputState.category), CATEGORIES) || null
  }, [inputState])

  const usersFolders = useMemo(() => {
    return folders && folders.length
      ? [
        { value: 'files', label: 'My Public Files', isPublic: true },
        ...folders.map(folder => ({
          value: folder.id,
          label: folder.name.replace(new RegExp('//', 'g'), '/'),
          isPublic: folder.isPublic,
        })),
      ]
      : [{ value: 'files', label: 'My Public Files', isPublic: true }]
  }, [folders])

  const selectedFolder = useMemo(() => {
    return R.find(R.propEq('value', inputState.folderId), usersFolders)
  }, [inputState, usersFolders])
  const folderPublic = selectedFolder && selectedFolder.isPublic

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
            error={checkError('name').message}
            errorMessage={checkError('name').message}
          />
        </div>
        <div className={c.EnterInfo_Field}>
          <Textarea
            id='description-input'
            name='description'
            label={isAssembly ? 'Description' : 'Description *'}
            type='description'
            value={inputState && inputState.description}
            onChange={handleOnInputChange}
            required={!isAssembly}
            error={checkError('description').message}
            errorMessage={checkError('description').message}
          />
        </div>
        {!isAssembly && folders && folders.length ? (
          <div className={c.EnterInfo_Field}>
            <Dropdown
              className={c.EnterInfo_Select}
              name='folder'
              placeholder={'Select folder'}
              value={selectedFolder}
              options={usersFolders}
              onChange={e => {
                if (e) handleOnInputChange('folderId', e.value)
              }}
              error={checkError('folder').message}
              errorMessage={checkError('folder').message}
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
            error={checkError('material').message}
            errorMessage={checkError('material').message}
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
              error={checkError('weight').message}
              errorMessage={checkError('weight').message}
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
              error={checkError('weight').message}
              errorMessage={checkError('weight').message}
            />
          </div>
        </div>
        {!isAssembly && (
          <div className={c.EnterInfo_Field}>
            <Dropdown
              className={c.EnterInfo_Select}
              name='category'
              placeholder='Select category'
              value={selectedCategory}
              isClearable
              options={CATEGORIES}
              onChange={e => {
                handleOnInputChange('category', e ? e.value : null)
              }}
              error={checkError('category').message}
              errorMessage={checkError('category').message}
            />
          </div>
        )}
        <Spacer size={'.5rem'} />
        <Toggle
          name='applyRemaining'
          label='Apply info to remaining models'
          checked={applyRemaining}
          onChange={ev => setApplyRemaining(ev.target.checked)}
        />
        <Spacer size={'1rem'} />
        <SingleLineBodyText>
          {folderPublic ? 'Public Model' : 'Private Model'}
        </SingleLineBodyText>
        <Spacer size={'.5rem'} />
        {folderPublic ? (
          <MetadataSecondary className={c.EnterInfo_PrivacyText}>
            The folder you have selected is Public. This model will be shared publicly
            towards users on Thangs.
          </MetadataSecondary>
        ) : (
          <MetadataSecondary className={c.EnterInfo_PrivacyText}>
            The folder you have selected is Private. This model will be private and
            restricted to yourself and those you to choose to share it with.
          </MetadataSecondary>
        )}
        <Spacer size={'1.5rem'} />
        <div className={c.EnterInfo_ButtonWrapper}>
          <Button type='submit' disabled={isLoading}>
            Continue
          </Button>
        </div>
      </form>
    </>
  )
}

export default EnterInfo
