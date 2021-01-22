import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as R from 'ramda'
import {
  Button,
  MultiLineBodyText,
  Pill,
  Spacer,
  Spinner,
  TitleTertiary,
  Toggle,
  Tooltip,
  TreeView,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as UploadCardIcon } from '@svg/upload-card.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'
import Dropzone from 'react-dropzone'
import { FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import { overlayview } from '@utilities/analytics'
import UploadTreeNode from './UploadTreeNode'

const useStyles = createUseStyles(theme => {
  return {
    UploadModels_UploadZone: {
      alignItems: 'center',
      border: `1px dashed ${theme.colors.white[900]}`,
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
    UploadModels_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    UploadModels_ButtonSpacer: {
      flex: 'none',
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
      display: 'flex',
      alignItems: 'center',
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
  }
})
const noop = () => null
const UploadModels = ({
  uploadFiles,
  uploadTreeData,
  allTreeNodes,
  onDrop = noop,
  onRemoveNode = noop,
  onCancel = noop,
  onContinue = noop,
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
}) => {
  const hasFile = Object.keys(uploadFiles).length > 0
  const c = useStyles({ hasFile })
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
  }, [
    allTreeNodes,
    setErrorMessage,
    setWarningMessage,
    uploadFiles,
    uploadTreeData,
    validated,
    validating,
  ])

  const uploadAssemblyLabel = (
    <span className={c.UploadAssemblyLabel}>
      Upload parts as multi-part
      <Tooltip title='Multipart assemblies allow users to view and download all parts from a single model page.'>
        <InfoIcon className={c.UploadAssemblyLabel_Icon} />
      </Tooltip>
    </span>
  )

  return (
    <>
      {(multiple || (!multiple && !hasFile)) && (
        <Dropzone
          onDrop={onDrop}
          accept={MODEL_FILE_EXTS}
          ref={dropzoneRef}
          multiple={multiple}
          maxFiles={25}
        >
          {({ getRootProps, getInputProps }) => (
            <section className={c.UploadModels_UploadZone}>
              <div {...getRootProps()}>
                <input {...getInputProps()} name='multi-upload' />
                <div className={c.UploadModels_UploadRow}>
                  <div className={c.UploadModels_UploadColumn}>
                    {R.isEmpty(uploadFiles) && <UploadCardIcon />}
                    <Spacer size={'1rem'} />
                    <TitleTertiary>
                      {multiple ? 'Drag & Drop files' : 'Drag & Drop file'}
                    </TitleTertiary>
                    <MultiLineBodyText>or browse to upload.</MultiLineBodyText>
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
          <TitleTertiary>
            <div className={c.UploadModels_FileTitle}>
              {fileLength > 1 ? `${fileLength} files` : 'File'}
              <Spacer size={'.5rem'} />
              {isLoadingFiles && <Spinner size={'1rem'} />}
            </div>
          </TitleTertiary>
          <Spacer size='0.5rem' />
          <TreeView
            className={c.UploadTreeView}
            nodes={uploadTreeData}
            levelPadding={28}
            defaultExpanded={uploadTreeData.length < 2}
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
          <div className={c.UploadModels_ButtonWrapper}>
            <Button secondary onClick={onCancel}>
              Cancel
            </Button>
            <Spacer size={'1rem'} className={c.UploadModels_ButtonSpacer} />
            <Button onClick={onContinue} disabled={isLoadingFiles || validating}>
              {isLoadingFiles || validating ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default UploadModels
