import React from 'react'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { UploadFrame } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'
import { ERROR_STATES, FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  return {
    Uploader: {},
    Uploader_Icon: {},
    Uploader_IconButton: {
      position: 'absolute',
      right: '2rem',
      top: '2rem',
    },
    Uploader_ErrorIcon: {
      color: theme.colors.purple[300],
    },
    Uploader_FlexColumn: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    Uploader_LinkColor: {
      ...theme.text.linkText,
    },
    Uploader_InfoMessage: {
      ...theme.text.uploadFrameText,
      color: theme.colors.purple[900],
      marginTop: '1.75rem',
      textAlign: 'center',
    },
    Uploader_SmallInfoMessage: {
      ...theme.text.smallInfoMessageText,
      marginTop: '2rem',
      maxWidth: '21.25rem',
    },
    Uploader_FileName: {
      ...theme.text.subheaderText,
      color: theme.colors.purple[900],
      marginTop: '1.75rem',
      textAlign: 'center',
      fontSize: '1.4rem',
      maxWidth: '38rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  }
})

const UploaderContent = ({ errorState, file, cancelUpload, showError }) => {
  const c = useStyles()

  return (
    <UploadFrame currentFile={file}>
      {showError ? (
        <div className={c.Uploader_FlexColumn}>
          <div className={c.Uploader_IconButton} onClick={cancelUpload}>
            <ErrorIcon className={c.Uploader_ErrorIcon} />
          </div>

          <div className={c.Uploader_InfoMessage}>
            Sorry, an unexpected error occurred. Please wait a moment and try to upload
            the model again.
          </div>
        </div>
      ) : file ? (
        <div className={c.Uploader_FlexColumn}>
          <div className={c.Uploader_IconButton} onClick={cancelUpload}>
            <ExitIcon />
          </div>
          <UploadIcon />
          <div className={c.Uploader_FileName}>
            <strong>File:</strong> {file.name}
          </div>
          {errorState === ERROR_STATES.SIZE_WARNING && (
            <div
              className={classnames(c.Uploader_SmallInfoMessage, c.Uploader_InfoMessage)}
            >
              Notice: Files over {FILE_SIZE_LIMITS.soft.pretty} may take a long time to
              upload & process.
            </div>
          )}
        </div>
      ) : errorState === ERROR_STATES.TOO_BIG ? (
        <div className={c.Uploader_FlexColumn}>
          <div className={c.Uploader_IconButton} onClick={cancelUpload}>
            <ExitIcon />
          </div>
          <ErrorIcon className={c.Uploader_ErrorIcon} />
          <div className={c.Uploader_InfoMessage}>
            File over {FILE_SIZE_LIMITS.hard.pretty}. Try uploading a different file.
          </div>
        </div>
      ) : errorState === ERROR_STATES.FILE_EXT ? (
        <div className={c.Uploader_FlexColumn}>
          <div className={c.Uploader_IconButton} onClick={cancelUpload}>
            <ExitIcon />
          </div>
          <ErrorIcon className={c.Uploader_ErrorIcon} />
          <div className={c.Uploader_InfoMessage}>
            File extension not supported. Supported file extensions include{' '}
            {MODEL_FILE_EXTS.map(e => e + ' ')}.
          </div>
        </div>
      ) : (
        <div className={c.Uploader_FlexColumn}>
          <UploadIcon className={c.Uploader_Icon} />
          <div className={c.Uploader_InfoMessage}>
            Drag & Drop a model
            <br />
            or <span className={c.Uploader_LinkColor}>browse</span> to choose file
          </div>
        </div>
      )}
      <div className={classnames(c.Uploader_InfoMessage, c.Uploader_SmallInfoMessage)}>
        Files can be up to {FILE_SIZE_LIMITS.hard.pretty} each. Files above{' '}
        {FILE_SIZE_LIMITS.soft.pretty} may take longer to upload and process.
      </div>
    </UploadFrame>
  )
}

export default UploaderContent
