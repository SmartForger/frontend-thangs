import React, { useCallback, useEffect, useMemo } from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import {
  Button,
  Divider,
  MetadataSecondary,
  MultiLineBodyText,
  Pill,
  SingleLineBodyText,
  Spacer,
  Spinner,
  TitleTertiary,
  Toggle,
  Tooltip,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as UploadCardIcon } from '@svg/upload-card.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'
import { formatBytes } from '@utilities'
import Dropzone from 'react-dropzone'
import { FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import { overlayview } from '@utilities/analytics'
import UploadTreeView, { mockFileTree } from './UploadTreeView'

const useStyles = createUseStyles(theme => {
  return {
    UploadModels_UploadZone: {
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
        width: '100%',
        outline: 'none',
      },
    },
    UploadModels_UploadRow: {
      height: '100%',
    },
    UploadModels_FileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    UploadModels_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

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
      textOverflow: 'ellipsis',
      width: '16rem',
      overflow: 'hidden',
      lineHeight: '1rem !important',
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    UploadModels_ScrollableFiles: {
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
        background: theme.colors.white[400],
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: `3px solid ${theme.colors.white[400]}`,
      },
    },
    UploadModels_RemoveBtn: {
      cursor: 'pointer',
      zIndex: 1,
    },
    UploadModels_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    UploadModels_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    UploadModels_WarningText: {
      color: '#C29C45',
      marginTop: '1.5rem',
      backgroundColor: '#FEFAEC',
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    UploadAssemblyLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    UploadAssemblyLabel_Icon: {
      marginLeft: '.5rem',
    },
  }
})
const noop = () => null
const UploadModels = ({
  uploadFiles,
  onDrop = noop,
  removeFile = noop,
  closeOverlay = noop,
  handleContinue = noop,
  setErrorMessage = noop,
  setWarningMessage = noop,
  errorMessage = null,
  warningMessage = null,
  isAssembly = false,
  setIsAssembly = noop,
  missingFiles = [],
  skipFile = noop,
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

  const toggleAssembly = useCallback(() => {
    setIsAssembly(!isAssembly)
  }, [isAssembly, setIsAssembly])

  useEffect(() => {
    overlayview('MultiUpload - UploadModels')
  }, [])

  useEffect(() => {
    const loadingFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isLoading)
    const warningFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isWarning)
    const mfiles = missingFiles.filter(f => !f.skipped)

    if (loadingFiles.length === 0 && mfiles.length === 0) setErrorMessage(null)
    if (warningFiles.length !== 0) {
      setWarningMessage(`Notice: Files over ${FILE_SIZE_LIMITS.soft.pretty} may take a long time to
    upload & process.`)
    } else if (Object.keys(uploadFiles).length > 25) {
      setWarningMessage(
        'Notice: Uploading more than 25 files at a time may take a long time to upload & process.'
      )
    } else {
      setWarningMessage(null)
    }
  }, [setErrorMessage, setWarningMessage, uploadFiles, missingFiles])

  const uploadAssemblyLabel = (
    <span className={c.UploadAssemblyLabel}>
      Upload as assembly
      <Tooltip title='Assemblies allow users to view and download all parts from a single model page.'>
        <InfoIcon className={c.UploadAssemblyLabel_Icon} />
      </Tooltip>
    </span>
  )

  return (
    <>
      <Dropzone onDrop={onDrop} accept={MODEL_FILE_EXTS} maxFiles={25}>
        {({ getRootProps, getInputProps }) => (
          <section className={c.UploadModels_UploadZone}>
            <div {...getRootProps()}>
              <input {...getInputProps()} name='multi-upload' />
              <div className={c.UploadModels_UploadRow}>
                <div className={c.UploadModels_UploadColumn}>
                  {R.isEmpty(uploadFiles) && <UploadCardIcon />}
                  <Spacer size={'1rem'} />
                  <TitleTertiary>Drag & Drop files</TitleTertiary>
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
      {errorMessage && (
        <>
          <h4 className={c.UploadModels_ErrorText}>{errorMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      {warningMessage && (
        <>
          <h4 className={c.UploadModels_WarningText}>{warningMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      {fileLength > 0 &&
        (isLoadingFiles ? (
          <>
            <Spacer size={'1.5rem'} />
            <TitleTertiary>
              {fileLength > 0
                ? `${fileLength} File${fileLength > 1 ? 's' : ''}`
                : 'Files'}
            </TitleTertiary>
            <Spacer size={'.5rem'} />
            <div className={c.UploadModels_ScrollableFiles}>
              {Object.keys(uploadFiles).map((id, index) => {
                const file = uploadFiles[id]
                const { name, size, isLoading } = file
                if (!name) return null
                return (
                  <div key={`fileUpload_${index}`}>
                    <Spacer size={'.75rem'} />
                    <div className={c.UploadModels_FileRow}>
                      <div className={c.UploadModels_Row}>
                        {isLoading ? <Spinner size={'1rem'} /> : <FileIcon />}
                        <Spacer size={'.75rem'} />
                        <SingleLineBodyText
                          className={c.UploadModels_FileName}
                          title={name}
                        >
                          {name}
                        </SingleLineBodyText>
                        <Spacer size={'.5rem'} />
                        <MetadataSecondary>{formatBytes(size)}</MetadataSecondary>
                      </div>
                      <div>
                        <TrashCanIcon
                          className={c.UploadModels_RemoveBtn}
                          onClick={() => removeFile(id)}
                        />
                      </div>
                    </div>
                    <Spacer size={'.75rem'} />
                    <Divider spacing={0} />
                  </div>
                )
              })}
            </div>
            <TitleTertiary>Missing Files</TitleTertiary>
            <Spacer size={'.5rem'} />
            <div>
              {missingFiles.map(f => (
                <div key={f.filename}>
                  <Spacer size={'.75rem'} />
                  <div className={c.UploadModels_FileRow}>
                    <div className={c.UploadModels_Row}>
                      {f.skipped ? (
                        <FileIcon className={c.UploadModels_SkippedFileIcon} />
                      ) : (
                        <InfoIcon className={c.UploadModels_MissingFileIcon} />
                      )}
                      <Spacer size={'.75rem'} />
                      <SingleLineBodyText
                        className={classnames(
                          c.UploadModels_FileName,
                          f.skipped ? 'skipped' : 'missing'
                        )}
                        title={f.filename}
                      >
                        {f.filename}
                      </SingleLineBodyText>
                    </div>
                    {!f.skipped && (
                      <Button
                        tertiary
                        className={c.UploadModels_SkipButton}
                        onClick={() => {
                          skipFile(f.filename)
                        }}
                      >
                        Skip
                      </Button>
                    )}
                  </div>
                  <Spacer size={'.75rem'} />
                  <Divider spacing={0} />
                </div>
              ))}
            </div>
            <Spacer size={'1rem'} />
            <Toggle
              id='upload_assembly'
              label={uploadAssemblyLabel}
              checked={isAssembly}
              onChange={toggleAssembly}
            />
            <Spacer size={'1.5rem'} />
            <div className={c.UploadModels_ButtonWrapper}>
              <Button secondary onClick={closeOverlay}>
                Cancel
              </Button>
              <Spacer size={'1rem'} />
              <Button onClick={handleContinue}>
                {isLoadingFiles ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </>
        ) : (
          <UploadTreeView fileTree={mockFileTree} />
        ))}
      <Spacer size={'2rem'} />
    </>
  )
}

export default UploadModels
