import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import * as R from 'ramda'
import {
  Button,
  Dropdown,
  Input,
  MetadataPrimary,
  MetadataSecondary,
  Spacer,
  SingleLineBodyText,
  Textarea,
  TitleTertiary,
  Toggle,
} from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import { CATEGORIES } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  return {
    AssemblyInfo_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    AssemblyInfo_FileName: {
      textOverflow: 'ellipsis',
      width: '16rem',
      overflow: 'hidden',
      lineHeight: '1rem !important',
    },
    AssemblyInfo_Column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    AssemblyInfo_UploadColumn: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    AssemblyInfo_ScrollableFiles: {
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
    AssemblyInfo_RemoveBtn: {
      cursor: 'pointer',
      zIndex: 1,
    },
    AssemblyInfo_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    AssemblyInfo_Thumbnail: {
      flex: 'none',
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      padding: '0px !important',
      width: '3.75rem',
      height: '3.75rem !important',
    },
    AssemblyInfo_ModelInfo: {
      '& h3': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '18rem',
        display: 'inline-block',
        lineHeight: '1rem',
      },
    },
    AssemblyInfo_PrivacyText: {
      width: '80%',
      textAlign: 'left !important',
    },
    AssemblyInfo_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
  }
})
const noop = () => null

const AssemblyInfo = ({
  folderId,
  folders = {},
  formData = {},
  isMultipart = false,
  uploadedFiles = [],
  setErrorMessage = noop,
  handleContinue = noop,
}) => {
  const c = useStyles({})
  const firstInputRef = useRef(null)

  const initialState = {
    name: '',
    description: '',
    folderId: 'files',
    category: '',
    primary: uploadedFiles[0].name,
    ...formData,
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
      setErrorMessage(null)
    },
    [onInputChange, setErrorMessage]
  )

  const handleSubmit = data => {
    handleContinue({ data })
  }

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

  const metaText =
    uploadedFiles.length > 1
      ? `Assembly • ${uploadedFiles.length} Parts`
      : 'Assembly • 1 Part'
  const folderPublic = selectedFolder && selectedFolder.isPublic
  const fileOptions = useMemo(() =>
    uploadedFiles.map(
      f => ({
        value: f.name,
        label: f.name,
      }),
      [uploadedFiles]
    )
  )
  const selectedPrimaryModel = useMemo(
    () => fileOptions.find(f => f.value === inputState.primary) || fileOptions[0],
    [fileOptions, inputState]
  )

  return (
    <>
      <div className={c.AssemblyInfo_Row}>
        <div className={c.AssemblyInfo_ModelInfo}>
          <TitleTertiary>Enter Information</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MetadataPrimary>{metaText}</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'1.5rem'} />
      <form onSubmit={onFormSubmit(handleSubmit)}>
        <div>
          <Input
            className={c.AssemblyInfo_FullWidthInput}
            name='name'
            label='Name *'
            maxLength='100'
            onChange={handleOnInputChange}
            value={inputState && inputState.name}
            required
            inputRef={firstInputRef}
          />
          <Spacer size={'1rem'} />
        </div>
        <div>
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
          <div>
            <Dropdown
              className={c.AssemblyInfo_Select}
              name='folder'
              placeholder={'Select folder'}
              value={selectedFolder}
              options={usersFolders}
              onChange={e => {
                if (e) handleOnInputChange('folderId', e.value)
              }}
            />
            <Spacer size={'1rem'} />
          </div>
        ) : null}
        <div>
          <Dropdown
            className={c.AssemblyInfo_Select}
            name='category'
            placeholder='Select category'
            isClearable
            options={CATEGORIES}
            onChange={e => {
              if (e) handleOnInputChange('category', e.value)
            }}
          />
          <Spacer size={'1rem'} />
        </div>
        {isMultipart && (
          <div>
            <Dropdown
              className={c.AssemblyInfo_Select}
              name='primary'
              placeholder='Select primary model'
              options={fileOptions}
              value={selectedPrimaryModel}
              onChange={e => {
                if (e) handleOnInputChange('primary', e.value)
              }}
            />
          </div>
        )}
        <Spacer size={'1.5rem'} />
        <SingleLineBodyText>
          {folderPublic ? 'Public Model' : 'Private Model'}
        </SingleLineBodyText>
        <Spacer size={'.5rem'} />
        {folderPublic ? (
          <MetadataSecondary className={c.AssemblyInfo_PrivacyText}>
            The folder you have selected is Public. This model will be shared publicly
            towards users on Thangs.
          </MetadataSecondary>
        ) : (
          <MetadataSecondary className={c.AssemblyInfo_PrivacyText}>
            The folder you have selected is Private. This model will be private and
            restricted to yourself and those you to choose to share it with.
          </MetadataSecondary>
        )}
        <Spacer size={'1.5rem'} />
        <div className={c.AssemblyInfo_ButtonWrapper}>
          <Button type='submit'>Continue</Button>
        </div>
      </form>
    </>
  )
}

export default AssemblyInfo
