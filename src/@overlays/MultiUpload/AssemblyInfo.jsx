import React, { useMemo, useRef, useEffect } from 'react'
import * as R from 'ramda'
import Joi from '@hapi/joi'
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
} from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import { CATEGORIES } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
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
    AssemblyInfo_TextAreaInput: {
      minWidth: '20rem',

      [md]: {
        minWidth: '24.25rem',
      },
    },
  }
})

const assemblyInfoSchema = ({ isRootAssembly }) =>
  Joi.object({
    name: Joi.string().required(),
    description: isRootAssembly ? Joi.string().required() : Joi.string().allow(''),
    primary: Joi.string().allow(''),
    folderId: Joi.string().allow(''),
    category: Joi.string().allow(''),
  })

// const multiPartInfoSchema = Joi.object({
//   name: Joi.string().required(),
//   description: Joi.string().required(),
//   primary: Joi.string().required(),
//   folderId: Joi.string().allow(''),
//   category: Joi.string().allow(''),
// })

const INITIAL_STATE = {
  name: '',
  description: '',
  folderId: 'files',
  category: '',
  primary: '',
}

const AssemblyInfo = ({
  activeNode,
  formData,
  treeData,
  folders,
  errorMessage: _err,
  setErrorMessage,
  onContinue,
  onUpdate,
}) => {
  const c = useStyles({})
  const firstInputRef = useRef(null)
  const isRootAssembly = useMemo(() => !activeNode.parentId, [activeNode.parentId])

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
    }),
    INITIAL_STATE,
  })

  const handleOnInputChange = (key, value) => {
    onInputChange(key, value)
    onUpdate(activeNode.id, { ...inputState, [key]: value })
    setErrorMessage(null)
  }

  const handleSubmit = (data, isValid) => {
    if (isValid) onContinue({ data })
  }

  const selectedFolder = useMemo(() => {
    return R.find(R.propEq('value', inputState.folderId), folders)
  }, [inputState, folders])
  const metaText =
    activeNode.subs.length > 1
      ? `Assembly • ${activeNode.subs.length} Parts`
      : `Assembly • ${activeNode.subs.length} Part`
  const folderPublic = selectedFolder && selectedFolder.isPublic
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
      })
    )
  }, [isRootAssembly, updateValidationSchema])

  return (
    <>
      {activeNode.parentId && (
        <>
          <div className={c.PartInfo_Row}>
            <MetadataSecondary>{pathFromRoot}</MetadataSecondary>
          </div>
          <Spacer size={'1rem'} />
        </>
      )}
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
        </div>
        <div>
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
        </div>
        {isRootAssembly && folders && folders.length > 1 ? (
          <div>
            <Dropdown
              className={c.AssemblyInfo_Select}
              name='folder'
              placeholder={'Select folder'}
              value={selectedFolder}
              options={folders}
              onChange={e => {
                if (e) handleOnInputChange('folderId', e.value)
              }}
              error={checkError('folder').message}
              errorMessage={checkError('folder').message}
            />
            <Spacer size={'1rem'} />
          </div>
        ) : null}
        {isRootAssembly && (
          <div>
            <Dropdown
              className={c.AssemblyInfo_Select}
              name='category'
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
            <Spacer size={'1rem'} />
          </div>
        )}
        {activeNode.id === 'multipart' && (
          <div>
            <Dropdown
              className={c.AssemblyInfo_Select}
              name='primary'
              placeholder='Select primary model *'
              options={fileOptions}
              value={selectedPrimaryModel}
              onChange={e => {
                if (e) handleOnInputChange('primary', e.value)
              }}
              error={checkError('primary').message}
              errorMessage={checkError('primary').message}
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
