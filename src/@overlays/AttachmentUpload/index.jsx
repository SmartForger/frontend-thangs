import React, { useCallback, useMemo, useState } from 'react'
import { SingleLineBodyText, Spacer, Spinner } from '@components'
import UploadFiles from './UploadFiles'
import Attachment from './Attachment'
import Error from './Error'
import Submitted from './Submitted'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { PHOTO_FILE_EXTS } from '@constants/fileUpload'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    AttachmentUpload: {
      minHeight: ({ isError }) => (isError ? '17rem' : '27.75rem'),
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      width: '100%',

      [md]: {
        width: '27.75rem',
      },
    },
    AttachmentUpload_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      minWidth: 0,
    },
    AttachmentUpload_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    AttachmentUpload_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    AttachmentUpload_BackButton: {
      top: '1.5rem',
      left: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    AttachmentUpload_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    AttachmentUpload_Column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    AttachmentUpload_LoaderScreen: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: '5',
      borderRadius: '1rem',
      display: 'flex',
    },
    AttachmentUpload__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
  }
})

const AttachmentUpload = ({ modelId }) => {
  const { dispatch, uploadAttachmentFiles = {} } = useStoreon(
    'uploadAttachmentFiles'
  )
  const {
    attachments = {},
    isLoading,
    isError,
    isSubmitted,
  } = uploadAttachmentFiles
  const [errorMessage, setErrorMessage] = useState(null)
  const [activeAttachmentPosition, setActiveAttachmentPosition] = useState(0)
  const c = useStyles({ isError })
  const { setOverlayOpen } = useOverlay()

  const onDrop = useCallback(
    (acceptedFiles, [rejectedFile], _event) => {
      if (rejectedFile) {
        const filePath = rejectedFile.path.split('.')
        const fileExt = filePath[filePath.length - 1] || ''
        track('AttachmentUpload - Rejected', { fileType: fileExt })
        setErrorMessage(
          `One or more files not supported. Supported file extensions include ${PHOTO_FILE_EXTS.map(
            e => ' ' + e.replace('.', '')
          )}.`
        )
      } else {
        const files = acceptedFiles.map(file => ({ id: file.name, file }))
        track('AttachmentUpload - OnDrop', { amount: files && files.length })
        dispatch(types.UPLOAD_ATTACHMENT_FILES, { files })
      }
    },
    [dispatch]
  )

  const activeAttachment = useMemo(
    () => Object.values(attachments).find(f => f.position === activeAttachmentPosition),
    [attachments, activeAttachmentPosition]
  )

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleContinue = () => setActiveAttachmentPosition(prevVal => prevVal + 1)
  const handleBack = () => setActiveAttachmentPosition(prevVal => prevVal - 1)
  const handleRetry = () => dispatch(types.RESET_UPLOAD_ATTACHMENT_FILES)
  const handleCancel = () => {
    dispatch(types.RESET_UPLOAD_ATTACHMENT_FILES)
    closeOverlay()
  }
  const handleSubmit = () => dispatch(types.SUBMIT_ATTACHMENTS, { modelId })

  const handleInputChange = useCallback(
    (field, newValue) => {
      dispatch(types.SET_ATTACHMENT_INFO, {
        id: activeAttachment.id,
        updatedAttachmentData: {
          [field]: newValue,
        },
      })
    },
    [activeAttachment, dispatch]
  )

  const formatOverlayTitle = useMemo(
    () => {
      if (isError) return 'Submit Failed'
      if (isSubmitted) return 'Photos Submitted'
      if (Object.values(attachments).length === 0) return 'Upload Print Photos'

      const attachmentLength = Object.values(attachments).length
      const photoPositionDisplay = `(${activeAttachmentPosition + 1}/${attachmentLength})`
      return `Add Print Photo ${attachmentLength > 1 ? photoPositionDisplay : ''}`
    },
    [isError, isSubmitted, activeAttachmentPosition, attachments]
  )

  const numOfAttachments = Object.values(attachments).length

  return (
    <div className={c.AttachmentUpload} data-cy='multi-upload-overlay'>
      {isLoading && (
        <div className={c.AttachmentUpload_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <Spacer size={'2rem'} />
      <div className={c.AttachmentUpload_Content}>
        <div className={c.AttachmentUpload_Column}>
          <Spacer size={'1.5rem'} />
          <div className={c.AttachmentUpload_Row}>
            <SingleLineBodyText className={c.AttachmentUpload_OverlayHeader}>
              {formatOverlayTitle}
            </SingleLineBodyText>
            {activeAttachment && activeAttachmentPosition > 0 && (<ArrowLeftIcon className={c.AttachmentUpload_BackButton} onClick={handleBack} />)}
            <ExitIcon className={c.AttachmentUpload_ExitButton} onClick={handleCancel} />
          </div>
          <Spacer size={'1.5rem'} />
        </div>
        {isError ? (
          <Error onCancel={handleCancel} onRetry={handleRetry} />
        ) : (isSubmitted ? (
          <Submitted onClose={handleCancel} />
        ) :
          activeAttachment ? (
            <Attachment
              attachment={activeAttachment}
              numOfAttachments={numOfAttachments}
              onCancel={handleCancel}
              onContinue={handleContinue}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />) : (
            <UploadFiles
              onDrop={onDrop}
              errorMessage={errorMessage}
            />
          ))}
        <Spacer size={'2rem'} className={c.AttachmentUpload__desktop} />
      </div>
      <Spacer size={'2rem'} />
    </div>
  )
}

export default AttachmentUpload
