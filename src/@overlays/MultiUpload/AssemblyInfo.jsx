import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Button,
  Dropdown,
  Input,
  MetadataPrimary,
  Spacer,
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
    isPrivate: false,
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

  const handleFolderChange = useCallback(
    e => {
      if (e) {
        handleOnInputChange('folderId', e.value)
        if (e.value !== 'files') {
          const folder = folders.find(folder => folder.id === e.value)
          handleOnInputChange('isPrivate', !folder.isPublic || inputState.isPrivate)
        }
      }
    },
    [inputState, folders, handleOnInputChange]
  )

  const togglePrivate = useCallback(() => {
    const folder = folders.find(folder => folder.id.toString() === inputState.folderId)
    if (folder && !folder.isPublic) {
      handleOnInputChange('isPrivate', true)
    } else {
      handleOnInputChange('isPrivate', !inputState.isPrivate)
    }
  }, [folders, inputState.folderId, inputState.isPrivate, handleOnInputChange])

  const handleSubmit = data => {
    handleContinue({ data })
  }

  const usersFolders = useMemo(() => {
    return folders && folders.length
      ? folders.map(folder => ({
        value: folder.id,
        label: folder.name.replace(new RegExp('//', 'g'), '/'),
      }))
      : []
  }, [folders])

  const selectedFolder = useMemo(() => {
    if (!folderId || !folders || !folders.length)
      return { value: 'files', label: 'My Public Files' }
    const folder = folders.find(folder => folder.id.toString() === folderId.toString())
    return { value: folderId, label: folder.name.replace(new RegExp('//', 'g'), '/') }
  }, [folderId, folders])

  useEffect(() => {
    // overlayview('MultiUpload - EnterInfo')
    firstInputRef.current.focus()
  }, [])

  return (
    <>
      <div className={c.AssemblyInfo_Row}>
        <div className={c.AssemblyInfo_ModelInfo}>
          <TitleTertiary>Enter Information</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MetadataPrimary>Assembly • 4 Parts</MetadataPrimary>
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
              defaultValue={selectedFolder}
              options={[{ value: 'files', label: 'My Public Files' }, ...usersFolders]}
              onChange={handleFolderChange}
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
        </div>
        <Spacer size={'0.5rem'} />
        <Toggle
          name='isPrivate'
          label={'Private assembly'}
          checked={inputState && inputState.isPrivate}
          onChange={togglePrivate}
        />
        <Spacer size={'1rem'} />
        <div className={c.AssemblyInfo_ButtonWrapper}>
          <Button type='submit'>Continue</Button>
        </div>
      </form>
      <Spacer size={'2rem'} />
    </>
  )
}

export default AssemblyInfo
