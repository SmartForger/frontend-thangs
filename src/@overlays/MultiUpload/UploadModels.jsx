import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import Dropzone from 'react-dropzone'
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
  ContainerColumn,
  ContainerRow,
  ModelThumbnail,
  Pill,
  Spacer,
  Spinner,
  Toggle,
  Tooltip,
  TreeView,
} from '@components'
import { FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import { overlayview } from '@utilities/analytics'
import { formatBytes } from '@utilities'
import UploadTreeNode from './UploadTreeNode'
import { isIOS } from '@utilities'

import { ReactComponent as UploadCardIcon } from '@svg/upload-card.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'

const useStyles = createUseStyles(theme => {
  return {
    UploadModels_UploadZone: {
      alignItems: 'center',
      border: `1px dashed ${theme.colors.white[900]}`,
      borderRadius: '.75rem',
      display: 'flex',
      flexDirection: 'column',
      height: ({ hasFile, noIcon }) =>
        hasFile ? '11rem' : noIcon ? '17.25rem' : '22.25rem',
      width: '100%',

      '& h3': {
        lineHeight: '1.5rem',
      },

      '& > div': {
        height: '100%',
        outline: 'none',
        width: '100%',
      },
    },
    UploadModels_UploadRow: {
      height: '100%',
    },
    UploadModels_FileTitle: {
      alignItems: 'center',
      display: 'flex',
    },
    UploadModels_FileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    UploadModels_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',

      '& svg': {
        flex: 'none',
      },
    },
    UploadModels_MissingFileIcon: {
      '& circle': {
        stroke: '#DA7069',
      },
      '& path': {
        fill: '#DA7069',
      },
      '& rect': {
        fill: '#DA7069',
      },
    },
    UploadModels_SkippedFileIcon: {
      '& path:first-child': {
        stroke: '#999',
      },
      '& path:last-child': {
        fill: '#999',
      },
    },
    UploadModels_FileName: {
      lineHeight: '1rem !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '16rem',
      '&.missing': {
        color: '#DA7069',
      },
      '&.skipped': {
        color: '#999',
        textDecoration: 'line-through',
      },
    },
    UploadModels_SkipButton: {
      padding: '0 1rem !important',
    },
    UploadModels_UploadColumn: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
    },
    UploadModels_ScrollableFiles: {
      ...theme.mixins.scrollbar,
      display: 'flex',
      flexDirection: 'column',
      height: '10.25rem',
      overflowX: 'hidden',
      overflowY: 'scroll',
      paddingTop: '.125rem',
    },
    UploadModels_RemoveBtn: {
      cursor: 'pointer',
      zIndex: '1',
    },
    UploadModels_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      borderRadius: '.5rem',
      fontWeight: '500',
      marginTop: '1.5rem',
      padding: '.625rem 1rem',
      wordBreak: 'break-word',
    },
    UploadModels_WarningText: {
      backgroundColor: '#FEFAEC',
      borderRadius: '.5rem',
      color: '#C29C45',
      fontWeight: '500',
      marginTop: '1.5rem',
      padding: '.625rem 1rem',
    },
    UploadAssemblyLabel: {
      alignItems: 'center',
      display: 'flex',
    },
    UploadAssemblyLabel_Icon: {
      marginLeft: '.5rem',
    },
    UploadTreeView: {
      flex: 1,
      maxHeight: '14rem',
      overflowY: 'auto',

      '& .loading': {
        width: 'calc(100% - 2rem)',

        '& > *': {
          marginLeft: '2rem',
        },
      },
    },
    UploadModels_BrowseText: {
      color: theme.colors.grey[300],
    },
    UploadModels_AssemblyText: {
      paddingTop: '1rem',
    },
    UploadModels_Thumbnail: {
      background: theme.colors.white[600],
      borderRadius: '.5rem',
      flex: 'none',
      height: '3rem !important',
      padding: '0px !important',
      width: '3rem',

      '& img': {
        position: 'relative',
        top: '.125rem',
      },
    },
  }
})
const noop = () => null
const UploadModels = ({
  uploadFiles,
  uploadTreeData,
  allTreeNodes,
  onDrop = noop,
  onRemoveNode = noop,
  setErrorMessage = noop,
  setWarningMessage = noop,
  errorMessage = null,
  warningMessage = null,
  isAssembly = false,
  setIsAssembly = noop,
  validating = false,
  validated = false,
  showAssemblyToggle,
  multiple = true,
  versionData,
}) => {
  const hasFile = Object.keys(uploadFiles).length > 0
  const noIcon = !!versionData
  const c = useStyles({ hasFile, noIcon })
  const isLoadingFiles = useMemo(() => {
    const loadingFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isLoading)
    return loadingFiles.length > 0
  }, [uploadFiles])
  const fileLength = uploadFiles
    ? Object.keys(uploadFiles).filter(fileId => uploadFiles[fileId].name).length
    : 0
  const dropzoneRef = useRef()

  const toggleAssembly = useCallback(() => {
    setIsAssembly(!isAssembly)
  }, [isAssembly, setIsAssembly])

  const uploadFile = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open()
    }
  }

  useEffect(() => {
    overlayview('MultiUpload - UploadModels')
  }, [])

  useEffect(() => {
    const loadingFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isLoading)
    const warningFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isWarning)
    const missingFiles = allTreeNodes.filter(f => !f.valid)

    if (loadingFiles.length === 0 && !validating) {
      const checkPartFile = node => {
        return (
          node.valid &&
          (!node.isAssembly || node.subs.some(subnode => checkPartFile(subnode)))
        )
      }

      const hasPartFiles = uploadTreeData.every(root => checkPartFile(root))

      if (hasPartFiles) {
        setErrorMessage(null)
      } else {
        setErrorMessage('Assembly require at least 1 part file')
      }
    }
    if (warningFiles.length !== 0) {
      setWarningMessage(`Notice: Files over ${FILE_SIZE_LIMITS.soft.pretty} may take a long time to
    upload & process.`)
    } else if (Object.keys(uploadFiles).length > 25 && !validated && !validating) {
      setWarningMessage(
        'Notice: Uploading more than 25 files at a time may take longer to upload & process.'
      )
    } else if (missingFiles.length > 0) {
      setWarningMessage(
        'Notice: Some parts are missing in your assembly. You can upload them now or continue without them.'
      )
    } else {
      setWarningMessage(null)
    }

    if (versionData?.parts?.length) {
      const numFilesToRemove = Object.keys(uploadFiles).length - versionData.parts.length
      if (numFilesToRemove > 0) {
        setErrorMessage(
          `The model you are versioning only has ${versionData.parts.length} parts. Please remove ${numFilesToRemove} of your files to proceed.`
        )
      } else {
        setErrorMessage(null)
      }
    }
  }, [
    allTreeNodes,
    setErrorMessage,
    setWarningMessage,
    uploadFiles,
    uploadTreeData,
    validated,
    validating,
    versionData,
  ])

  const uploadAssemblyLabel = (
    <span className={c.UploadAssemblyLabel}>
      Upload parts as multi-part
      <Tooltip title='Multipart assemblies allow users to view and download all parts from a single model page.'>
        <InfoIcon className={c.UploadAssemblyLabel_Icon} />
      </Tooltip>
    </span>
  )
  const showTopSpinner = isLoadingFiles && uploadTreeData.length > 8

  return (
    <>
      {versionData && (
        <>
          <ContainerRow>
            {versionData?.parts?.length === 1 && (
              <>
                <ModelThumbnail
                  className={c.UploadModels_Thumbnail}
                  name={versionData.name}
                  model={versionData}
                  mini={true}
                  useThumbnailer={false}
                />
                <Spacer size={'.75rem'} />
              </>
            )}
            <ContainerColumn justifyContent={'center'} alignItems={'flex-start'}>
              <Body>{versionData.name}</Body>
              {versionData.parts ? (
                <>
                  <Spacer size={'.5rem'} />
                  <Metadata type={MetadataType.secondary}>
                    {versionData.parts.length > 1
                      ? `${versionData.parts.length} Parts`
                      : formatBytes(versionData.parts[0].size)}
                  </Metadata>
                </>
              ) : null}
            </ContainerColumn>
          </ContainerRow>
          <Spacer size={'1.5rem'} />
        </>
      )}
      {(multiple || (!multiple && !hasFile)) && (
        <Dropzone
          onDrop={onDrop}
          accept={isIOS() ? undefined : MODEL_FILE_EXTS}
          ref={dropzoneRef}
          multiple={multiple}
        >
          {({ getRootProps, getInputProps }) => (
            <section className={c.UploadModels_UploadZone}>
              <div {...getRootProps()}>
                <input {...getInputProps()} name='multi-upload' />
                <div className={c.UploadModels_UploadRow}>
                  <div className={c.UploadModels_UploadColumn}>
                    {R.isEmpty(uploadFiles) && !versionData && <UploadCardIcon />}
                    <Spacer size={'1rem'} />
                    <Title headerLevel={HeaderLevel.tertiary}>
                      {multiple ? 'Drag & Drop files' : 'Drag & Drop file'}
                    </Title>
                    <Body multiline>or browse to upload.</Body>
                    <Spacer size={'1rem'} />
                    <Pill secondary>Browse</Pill>
                    <Spacer size={'.75rem'} />
                  </div>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      )}

      {errorMessage && <h4 className={c.UploadModels_ErrorText}>{errorMessage}</h4>}
      {warningMessage && <h4 className={c.UploadModels_WarningText}>{warningMessage}</h4>}
      {fileLength > 0 && (
        <>
          <Spacer size='1rem' />
          <Title headerLevel={HeaderLevel.tertiary}>
            <div className={c.UploadModels_FileTitle}>
              {fileLength > 1 ? `${fileLength} files` : 'File'}
              <Spacer size={'.5rem'} />
              {showTopSpinner && <Spinner size={'1rem'} />}
            </div>
          </Title>
          <Spacer size='0.5rem' />
          <TreeView
            className={c.UploadTreeView}
            nodes={uploadTreeData}
            levelPadding={28}
            defaultExpanded={uploadTreeData.length < 2}
            showDivider={false}
            renderNode={(node, level) => (
              <UploadTreeNode
                node={node}
                level={level}
                onUpload={uploadFile}
                onRemove={onRemoveNode}
                isLoading={validating}
              />
            )}
          />
          <Spacer size={'1rem'} />
          {showAssemblyToggle && (
            <>
              <Toggle
                id='upload_assembly'
                label={uploadAssemblyLabel}
                checked={isAssembly}
                onChange={toggleAssembly}
              />
            </>
          )}
          <Spacer size={'1rem'} />
        </>
      )}
    </>
  )
}

export default UploadModels
