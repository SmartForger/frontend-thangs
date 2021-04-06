import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SingleLineBodyText, Spacer, Spinner } from '@components'
import UploadFiles from './UploadFiles'
import Attachment from './Attachment'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { ERROR_STATES, FILE_SIZE_LIMITS, PHOTO_FILE_EXTS } from '@constants/fileUpload'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    MultiUpload: {
      minHeight: '27.75rem',
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
    MultiUpload_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      minWidth: 0,
    },
    MultiUpload_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    MultiUpload_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    MultiUpload_BackButton: {
      top: '1.5rem',
      left: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    MultiUpload_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    MultiUpload_Column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    MultiUpload_LoaderScreen: {
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
    MultiUpload__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
  }
})

const AttachmentUpload = ({ initData = null }) => {
  const { dispatch, uploadAttachmentFiles = {} } = useStoreon(
    'uploadAttachmentFiles'
  )

  const {
    attachments = [],
    fileData = [],
    isLoading,
  } = uploadAttachmentFiles
  const [errorMessage, setErrorMessage] = useState(null)
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(0)
  const c = useStyles({})
  const { setOverlayOpen } = useOverlay()

  const onDrop = useCallback(
    (acceptedFiles, [rejectedFile], _event) => {
      const files = acceptedFiles
        .map(file => {
          const ext = `.${file.name.split('.').slice(-1)[0].toLowerCase()}`
          if (!PHOTO_FILE_EXTS.includes(ext)) {
            setErrorMessage(
              `${file.name} is not a supported file type.
              Supported file extensions include ${PHOTO_FILE_EXTS.map(
                e => ' ' + e.replace('.', '')
              )}.`
            )
            return null
          }

          const fileObj = {
            id: file.name,
            file,
          }

          if (file.size >= FILE_SIZE_LIMITS.hard.size) {
            setErrorMessage(
              `One or more files was over ${FILE_SIZE_LIMITS.hard.pretty}. Try uploading a different file.`
            )
            return null
          } else if (file.size >= FILE_SIZE_LIMITS.soft.size) {
            fileObj.errorState = { warning: ERROR_STATES.SIZE_WARNING }
          }

          return fileObj
        })
        .filter(f => !!f)

      track('AttachmentUpload - OnDrop', { amount: files && files.length })

      dispatch(types.UPLOAD_ATTACHMENT_FILES, { files })

      if (rejectedFile) {
        const filePath = rejectedFile.path.split('.')
        const fileExt = filePath[filePath.length - 1] || ''
        track('AttachmentUpload - Rejected', { fileType: fileExt })
        setErrorMessage(
          `One or more files not supported. Supported file extensions include ${PHOTO_FILE_EXTS.map(
            e => ' ' + e.replace('.', '')
          )}.`
        )
      }
    },
    [dispatch]
  )

  const activeAttachment = useMemo(
    () => attachments[activeAttachmentIndex],
    [attachments, activeAttachmentIndex]
  )

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleContinue = useCallback(
    ({ data }) => {
      if (activeAttachmentIndex < attachments.length) {
        setActiveAttachmentIndex(prevVal => prevVal + 1)
      } else {
        // TODO[MARCEL]: submit and show "photos submitted" overlay
      }
    },
    [attachments, activeAttachmentIndex]
  )

  useEffect(() => {
    if (initData) onDrop(initData.acceptedFiles, initData.rejectedFile, initData.e)
  }, [initData, onDrop])

  return (
    <div className={c.MultiUpload} data-cy='multi-upload-overlay'>
      {isLoading && (
        <div className={c.MultiUpload_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <Spacer size={'2rem'} />
      <div className={c.MultiUpload_Content}>
        <div className={c.MultiUpload_Column}>
          <Spacer size={'1.5rem'} />
          <div className={c.MultiUpload_Row}>
            <SingleLineBodyText className={c.MultiUpload_OverlayHeader}>
              {activeAttachment ? `Add Print Photo (${activeAttachmentIndex + 1}/${attachments.length})` : 'Upload Print Photos'}
            </SingleLineBodyText>
            <ExitIcon className={c.MultiUpload_ExitButton} onClick={closeOverlay} />
          </div>
          <Spacer size={'1.5rem'} />
        </div>
        {activeAttachment ? (
          <Attachment
            attachment={activeAttachment}
            activeAttachmentIndex={activeAttachmentIndex}
            fileData={fileData}
            onContinue={handleContinue}
          />) : (
          <UploadFiles
            onDrop={onDrop}
            isLoading={isLoading}
          />
        )}
        <Spacer size={'2rem'} className={c.MultiUpload__desktop} />
      </div>
      <Spacer size={'2rem'} />
    </div>
  )
}

export default AttachmentUpload
