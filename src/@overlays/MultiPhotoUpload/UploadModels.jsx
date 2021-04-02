import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as R from 'ramda'
import {
  Button,
  MultiLineBodyText,
  Pill,
  Spacer,
  Spinner,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as UploadCardIcon } from '@svg/upload-card.svg'
import Dropzone from 'react-dropzone'
import { FILE_SIZE_LIMITS, PHOTO_FILE_EXTS } from '@constants/fileUpload'
import { overlayview } from '@utilities/analytics'
import { isIOS } from '@utilities'

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
  onDrop = noop,
  onCancel = noop,
  onContinue = noop,
  setErrorMessage = noop,
  setWarningMessage = noop,
  errorMessage = null,
  warningMessage = null,
}) => {
  const hasFile = Object.keys(uploadFiles).length > 0
  const c = useStyles({ hasFile })
  const isLoadingFiles = useMemo(() => {
    const loadingFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isLoading)
    return loadingFiles.length > 0
  }, [uploadFiles])
  const fileLength = uploadFiles
    ? Object.keys(uploadFiles).filter(fileId => uploadFiles[fileId].fileName).length
    : 0
  const dropzoneRef = useRef()

  useEffect(() => {
    overlayview('MultiPhotoUpload - UploadModels')
  }, [])

  useEffect(() => {
    const loadingFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isLoading)
    const warningFiles = Object.keys(uploadFiles).filter(id => uploadFiles[id].isWarning)

    if (loadingFiles.length === 0) {
      setErrorMessage(null)
    }
    if (warningFiles.length !== 0) {
      setWarningMessage(`Notice: Files over ${FILE_SIZE_LIMITS.soft.pretty} may take a long time to
    upload & process.`)
    } else if (Object.keys(uploadFiles).length > 25) {
      setWarningMessage(
        'Notice: Uploading more than 25 files at a time may take longer to upload & process.'
      )
    } else {
      setWarningMessage(null)
    }
  }, [
    setErrorMessage,
    setWarningMessage,
    uploadFiles,
  ])

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        accept={isIOS() ? undefined : PHOTO_FILE_EXTS}
        ref={dropzoneRef}
        multiple={true}
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
                    Drag & Drop photos
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
          {Object.values(uploadFiles).map(f => <div>{f.fileName}</div>)}
          <Spacer size={'1rem'} />
          <div className={c.UploadModels_ButtonWrapper}>
            <Button secondary onClick={onCancel}>
              Cancel
            </Button>
            <Spacer size={'1rem'} className={c.UploadModels_ButtonSpacer} />
            <Button onClick={onContinue} disabled={isLoadingFiles}>
              {isLoadingFiles ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default UploadModels
