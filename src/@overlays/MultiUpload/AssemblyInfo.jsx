import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as R from 'ramda'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Body,
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
} from '@physna/voxel-ui/@atoms/Typography'

import {
  Button,
  Dropdown,
  Input,
  LicenseField,
  SelectFolderActionMenu,
  Spacer,
  Textarea,
} from '@components'
import { useForm } from '@hooks'
import { CATEGORIES } from '@constants/fileUpload'
import { VALIDATION_PATTERN, VALIDATION_REQUIRED } from '@utilities/validation'

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
    AssemblyInfo_FieldRow: {
      alignItems: 'flex-end',
      display: 'flex',
      flexDirection: 'row',
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
      ...theme.mixins.scrollbar,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      overflowY: 'scroll',
      height: '10.25rem',
      paddingTop: '.125rem',
    },
    AssemblyInfo_RemoveBtn: {
      cursor: 'pointer',
      zIndex: '1',
    },
    AssemblyInfo_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: '500',
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
    AssemblyInfo_TextAreaInput: {
      minWidth: '20rem',
    },
  }
})

const assemblyInfoSchema = ({ isRootAssembly, isMultipart }) => ({
  name: {
    label: 'Name',
    rules: [
      VALIDATION_REQUIRED,
      {
        type: VALIDATION_PATTERN,
        pattern: new RegExp('^[^/]+$'),
      },
    ],
    messages: {
      [VALIDATION_PATTERN]: 'Name should not contain "/"',
    },
  },
  description: {
    label: 'Description',
    rules: isRootAssembly ? [VALIDATION_REQUIRED] : [],
  },
  primary: {
    label: 'Primary Model',
    rules: isMultipart ? [VALIDATION_REQUIRED] : [],
  },
})

const INITIAL_STATE = {
  name: '',
  description: '',
  folderId: '',
  category: '',
  primary: '',
  license: '',
}

const OBJ_EXTENSION_REGEX = /\.obj$/

const AssemblyInfo = ({
  activeNode,
  errorMessage: _err,
  filesData,
  formData = INITIAL_STATE,
  onContinue,
  setErrorMessage,
  treeData,
}) => {
  const c = useStyles({})
  const firstInputRef = useRef(null)
  const isRootAssembly = useMemo(() => !activeNode.parentId, [activeNode.parentId])
  const isObjAssembly = useMemo(
    () =>
      activeNode?.isAssembly && OBJ_EXTENSION_REGEX.test(activeNode?.name?.toLowerCase()),
    [activeNode.isAssembly, activeNode.name]
  )
  const isMultipart = activeNode.id === 'multipart'
  const file = filesData[activeNode.fileId]
  const [folderPublic, setFolderPublic] = useState(true)
  const [initialFolderValue] = useState(formData && formData.folderId)

  // HOTFIX 4/18/21 - Make the root assembly part of an OBJ the primary part
  useEffect(() => {
    if (isObjAssembly) {
      formData.primary = activeNode.id
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObjAssembly])

  const {
    checkError,
    onFormSubmit,
    onInputChange,
    inputState,
    setInputState,
    updateValidationSchema,
  } = useForm({
    initialValidationSchema: assemblyInfoSchema({
      isRootAssembly,
      isMultipart,
    }),
    INITIAL_STATE,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
      setErrorMessage(null)
    },
    [onInputChange, setErrorMessage]
  )

  const handleLicenseChange = useCallback(
    data => {
      onInputChange('license', data)
    },
    [onInputChange]
  )

  const handleFolderChange = useCallback(
    folder => {
      handleOnInputChange('folderId', folder.value)
      setFolderPublic(folder.isPublic)
    },
    [handleOnInputChange]
  )

  const handleSubmit = useCallback(
    (data, isValid, errors) => {
      if (!isValid) {
        return setErrorMessage(errors?.[0]?.message)
      }

      onContinue({ data })
    },
    [onContinue, setErrorMessage]
  )

  const metaText =
    activeNode.subs.length > 1
      ? `Assembly • ${activeNode.subs.length} Parts`
      : `Assembly • ${activeNode.subs.length} Part`

  const fileOptions = useMemo(
    () =>
      activeNode.subs.map(node => ({
        value: node.id,
        label: node.name,
      })),
    [activeNode]
  )
  const selectedPrimaryModel = useMemo(
    () => fileOptions.find(f => f.value === inputState.primary),
    [fileOptions, inputState]
  )
  const selectedCategory = useMemo(() => {
    return R.find(R.propEq('value', inputState.category), CATEGORIES) || null
  }, [inputState])

  const pathFromRoot = useMemo(() => {
    if (activeNode.parentId === 'multipart') {
      return ['Multipart Model', activeNode.name].join(' / ')
    }

    const path = []
    let node = activeNode
    while (node) {
      path.unshift(node)
      node = treeData[node.parentId]
    }

    return path.map(node => node.name).join(' / ')
  }, [activeNode, treeData])

  useEffect(() => {
    setInputState(formData)
    // eslint-disable-next-line
  }, [activeNode])

  useEffect(() => {
    updateValidationSchema(
      assemblyInfoSchema({
        isRootAssembly,
        isMultipart,
      })
    )
  }, [isRootAssembly, isMultipart, updateValidationSchema])

  return (
    <>
      {activeNode.parentId && (
        <>
          <div className={c.PartInfo_Row}>
            <Metadata type={MetadataType.secondary}>{pathFromRoot}</Metadata>
          </div>
          <Spacer size={'1rem'} />
        </>
      )}
      <div className={c.AssemblyInfo_Row}>
        <div className={c.AssemblyInfo_ModelInfo}>
          <Title headerLevel={HeaderLevel.tertiary}>Enter Information</Title>
          <Spacer size={'.5rem'} />
          <Metadata type={MetadataType.primary}>{metaText}</Metadata>
        </div>
      </div>
      <Spacer size={'1.5rem'} />
      <form onSubmit={onFormSubmit(handleSubmit)}>
        <SelectFolderActionMenu
          error={checkError('folderId').message}
          errorMessage={checkError('folderId').message}
          initialValue={initialFolderValue}
          onChange={handleFolderChange}
          selectedValue={inputState.folderId}
        />
        <Spacer size={'1rem'} />
        <Input
          autoComplete='off'
          className={c.AssemblyInfo_FullWidthInput}
          name='name'
          label='Name *'
          maxLength='100'
          onChange={handleOnInputChange}
          value={inputState && inputState.name}
          inputRef={firstInputRef}
          error={checkError('name').message}
          errorMessage={checkError('name').message}
        />
        <Spacer size={'1rem'} />
        {!activeNode.parentId && (
          <>
            <LicenseField
              model={file}
              className={c.AssemblyInfo_FieldRow}
              onChange={handleLicenseChange}
              value={inputState && inputState.license}
            />
            <Spacer size='1rem' />
          </>
        )}
        <Textarea
          className={c.AssemblyInfo_TextAreaInput}
          id='description-input'
          name='description'
          label={isRootAssembly ? 'Description *' : 'Description'}
          type='description'
          value={inputState && inputState.description}
          onChange={handleOnInputChange}
          error={checkError('description').message}
          errorMessage={checkError('description').message}
        />
        <Spacer size={'1rem'} />
        {isMultipart && (
          <div>
            <Dropdown
              className={c.AssemblyInfo_Select}
              name='primary'
              label='Select primary model *'
              options={fileOptions}
              value={selectedPrimaryModel}
              onChange={e => {
                if (e) handleOnInputChange('primary', e.value)
              }}
              error={checkError('primary').message}
              errorMessage={checkError('primary').message}
            />
            <Spacer size={'1rem'} />
          </div>
        )}
        {isRootAssembly && (
          <Dropdown
            className={c.AssemblyInfo_Select}
            name='category'
            label='Category'
            placeholder='Select category'
            isClearable
            options={CATEGORIES}
            value={selectedCategory}
            onChange={e => {
              if (e) handleOnInputChange('category', e.value)
            }}
            error={checkError('category').message}
            errorMessage={checkError('category').message}
          />
        )}
        <Spacer size={'1.5rem'} />
        <Body>{folderPublic ? 'Public Model' : 'Private Model'}</Body>
        <Spacer size={'.5rem'} />
        {folderPublic ? (
          <Metadata type={MetadataType.secondary} className={c.AssemblyInfo_PrivacyText}>
            The folder you have selected is Public. This model will be shared publicly
            towards users on Thangs.
          </Metadata>
        ) : (
          <Metadata type={MetadataType.secondary} className={c.AssemblyInfo_PrivacyText}>
            The folder you have selected is Private. This model will be private and
            restricted to yourself and those you to choose to share it with.
          </Metadata>
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
