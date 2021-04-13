import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import * as R from 'ramda'
import Joi from '@hapi/joi'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
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
  ModelThumbnail,
  SingleLineBodyText,
  Spacer,
  Textarea,
  Toggle,
  SelectFolderActionMenu,
} from '@components'
import { useForm } from '@hooks'
import { formatBytes } from '@utilities'
import { CATEGORIES } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    PartInfo: {
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'row',
      minHeight: '27.75rem',
      position: 'relative',

      [md]: {
        width: '27.75rem',
      },
    },
    PartInfo_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
    },
    PartInfo_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    PartInfo_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    PartInfo_UploadZone: {
      alignItems: 'center',
      border: '1px dashed #E5E5F3',
      borderRadius: '.75rem',
      display: 'flex',
      flexDirection: 'column',
      height: ({ hasFile }) => (hasFile ? '11rem' : '22.25rem'),
      width: '100%',

      '& h3': {
        lineHeight: '1.5rem',
      },

      '& > div': {
        height: '100%',
        outline: 'none',
      },
    },
    PartInfo_UploadRow: {
      height: '100%',
    },
    PartInfo_FileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    PartInfo_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    PartInfo_FieldRow: {
      alignItems: 'baseline',
      display: 'flex',
      flexDirection: 'row',
    },
    PartInfo_Field: {
      flexGrow: 1,
      marginBottom: '1rem',
      position: 'relative',
    },
    PartInfo_Field__FolderMenu: {
      '& > div': {
        width: '100%',
      },
    },
    PartInfo_FolderMenu: {
      width: '100%',
    },
    PartInfo_FileName: {
      lineHeight: '1rem !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '16rem',
    },
    PartInfo_Column: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    PartInfo_UploadColumn: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
    },
    PartInfo_ScrollableFiles: {
      ...theme.mixins.scrollbar,
      display: 'flex',
      flexDirection: 'column',
      height: '10.25rem',
      overflowX: 'hidden',
      overflowY: 'scroll',
      paddingTop: '.125rem',
    },
    PartInfo_RemoveBtn: {
      cursor: 'pointer',
      zIndex: '1',
    },
    PartInfo_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    PartInfo_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      borderRadius: '.5rem',
      fontWeight: '500',
      padding: '.625rem 1rem',
    },
    PartInfo_Thumbnail: {
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      flex: 'none',
      height: '3.75rem !important',
      padding: '0px !important',
      width: '3.75rem',
    },
    PartInfo_ModelInfo: {
      '& h3': {
        display: 'inline-block',
        lineHeight: '1rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        [md]: {
          width: '18rem',
        },
      },
    },
    PartInfo_PrivacyText: {
      textAlign: 'left !important',
      width: '80%',
    },
  }
})

const PartInfoSchema = ({ isRootPart }) =>
  Joi.object({
    name: Joi.string().pattern(new RegExp('^[^/]+$')).required(),
    description: isRootPart ? Joi.string().required() : Joi.string().allow(''),
    folderId: Joi.string().allow(''),
    material: Joi.string().allow(''),
    height: Joi.string().allow(''),
    weight: Joi.string().allow(''),
    category: Joi.string().allow(''),
    previousVersionModelId: Joi.string().allow(''),
  }).unknown(true)

const initialState = {
  name: '',
  description: '',
  folderId: '',
  material: '',
  height: '',
  weight: '',
  category: '',
  license: '',
}

const PartInfo = props => {
  const {
    activeNode,
    errorMessage,
    filesData,
    formData,
    isLoading,
    multipartName,
    onContinue,
    setErrorMessage,
    treeData,
  } = props
  const c = useStyles({})
  const firstInputRef = useRef(null)
  const file = filesData[activeNode.fileId]
  const [applyRemaining, setApplyRemaining] = useState(false)
  const [folderPublic, setFolderPublic] = useState(true)
  const [initialFolderValue] = useState(formData && formData.folderId)

  const isRootPart = useMemo(() => !activeNode.parentId, [activeNode.parentId])
  const {
    checkError,
    onFormSubmit,
    onInputChange,
    inputState,
    setInputState,
    updateValidationSchema,
  } = useForm({
    initialValidationSchema: PartInfoSchema({ isRootPart }),
    initialState,
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
    (data, isValid) => {
      if (isValid) onContinue({ applyRemaining, data })
    },
    [applyRemaining, onContinue]
  )

  const selectedCategory = useMemo(() => {
    return R.find(R.propEq('value', inputState.category), CATEGORIES) || null
  }, [inputState])

  const pathFromRoot = useMemo(() => {
    if (activeNode.parentId === 'multipart') {
      return [multipartName, activeNode.name].join(' / ')
    }

    const path = []
    let node = activeNode
    while (node) {
      path.unshift(node)
      node = treeData[node.parentId]
    }

    return path.map(node => node.name).join(' / ')
  }, [activeNode, treeData, multipartName])

  useEffect(() => {
    setInputState(formData)
    // eslint-disable-next-line
  }, [activeNode])

  useEffect(() => {
    updateValidationSchema(PartInfoSchema({ isRootPart }))
  }, [isRootPart, updateValidationSchema])

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
      <div className={c.PartInfo_Row}>
        {file && (
          <>
            <ModelThumbnail
              className={c.PartInfo_Thumbnail}
              name={file.name}
              model={file}
              mini={true}
              useThumbnailer={true}
            />
            <Spacer size={'1rem'} />
          </>
        )}

        <div className={c.PartInfo_ModelInfo}>
          <Title headerLevel={HeaderLevel.tertiary} title={activeNode.name}>
            {activeNode.name}
          </Title>
          {activeNode.size && (
            <>
              <Spacer size={'.5rem'} />
              <Metadata type={MetadataType.primary}>
                {formatBytes(activeNode.size)}
              </Metadata>
            </>
          )}
        </div>
      </div>
      <Spacer size={'1.5rem'} />
      {errorMessage && (
        <>
          <h4 className={c.PartInfo_ErrorText}>{errorMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      <form onSubmit={onFormSubmit(handleSubmit)}>
        {isRootPart && (
          <div className={classnames(c.PartInfo_Field, c.PartInfo_Field__FolderMenu)}>
            <SelectFolderActionMenu
              error={checkError('folderId').message}
              errorMessage={checkError('folderId').message}
              initialValue={initialFolderValue}
              onChange={handleFolderChange}
              selectedValue={inputState.folderId}
            />
          </div>
        )}
        <div className={c.PartInfo_Field}>
          <Input
            autoComplete='off'
            className={c.PartInfo_FullWidthInput}
            name='name'
            label='Name *'
            maxLength='100'
            onChange={handleOnInputChange}
            value={inputState && inputState.name}
            inputRef={firstInputRef}
            error={checkError('name').message}
            errorMessage={checkError('name').message}
          />
        </div>
        {!activeNode.parentId && (
          <LicenseField
            model={file}
            className={c.PartInfo_FieldRow}
            onChange={handleLicenseChange}
            value={inputState && inputState.license}
          />
        )}
        <div className={c.PartInfo_Field}>
          <Textarea
            id='description-input'
            name='description'
            label={isRootPart ? 'Description *' : 'Description'}
            type='description'
            value={inputState && inputState.description}
            onChange={handleOnInputChange}
            error={checkError('description').message}
            errorMessage={checkError('description').message}
          />
        </div>
        <div className={c.PartInfo_Field}>
          <Input
            className={c.PartInfo_FullWidthInput}
            name='material'
            label='Material'
            maxLength='50'
            onChange={handleOnInputChange}
            value={inputState && inputState.material}
            error={checkError('material').message}
            errorMessage={checkError('material').message}
          />
        </div>
        <div className={c.PartInfo_FieldRow}>
          <div className={c.PartInfo_Field}>
            <Input
              className={c.PartInfo_FullWidthInput}
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
          <div className={c.PartInfo_Field}>
            <Input
              className={c.PartInfo_FullWidthInput}
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
        {isRootPart && (
          <div className={c.PartInfo_Field}>
            <Dropdown
              className={c.PartInfo_Select}
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
        {isRootPart && (
          <>
            <Spacer size={'1rem'} />
            <SingleLineBodyText>
              {folderPublic ? 'Public Model' : 'Private Model'}
            </SingleLineBodyText>
            <Spacer size={'.5rem'} />
            {folderPublic ? (
              <Metadata type={MetadataType.secondary} className={c.PartInfo_PrivacyText}>
                The folder you have selected is Public. This model will be shared publicly
                towards users on Thangs.
              </Metadata>
            ) : (
              <Metadata type={MetadataType.secondary} className={c.PartInfo_PrivacyText}>
                The folder you have selected is Private. This model will be private and
                restricted to yourself and those you to choose to share it with.
              </Metadata>
            )}
          </>
        )}
        <Spacer size={'1.5rem'} />
        <div className={c.PartInfo_ButtonWrapper}>
          <Button type='submit' disabled={isLoading}>
            Continue
          </Button>
        </div>
      </form>
    </>
  )
}

export default PartInfo
