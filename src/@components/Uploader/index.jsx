import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { UploadFrame } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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

const MODEL_FILE_EXTS = [
  '.3dxml', // THREE_D_XML
  '.CATPart', // CATIAV5
  '.dwg',
  '.dxf',
  '.iges',
  '.igs',
  '.ipt', // Inventor
  '.jt',
  '.model', // CATIAV4
  '.par', // SolidEdge
  '.prt', // NX, ProE_Creo
  '.sab', // ACIS_Binary
  '.sat', // ACIS
  '.sldprt', // SolidWorks
  '.step',
  '.stl',
  '.stp',
  '.vda',
  '.x_b', // ParaSolid_Binary
  '.x_t', // ParaSolid
  '.xcgm',
  '.xml', // XMLEBOM
]

const FILE_SIZE_LIMITS = {
  hard: {
    size: 250_000_000,
    pretty: '250MB',
  },
  soft: {
    size: 50_000_000,
    pretty: '50MB',
  },
}

const Uploader = ({ file, setFile, showError = true }) => {
  const c = useStyles()
  const [errorState, setErrorState] = useState()
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles, _event) => {
      const file = acceptedFiles[0]
      if (rejectedFiles[0]) {
        setErrorState('FILE_EXT')
        setFile(null)
      } else if (file.size >= FILE_SIZE_LIMITS.hard.size) {
        setErrorState('TOO_BIG')
        setFile(null)
      } else if (file.size >= FILE_SIZE_LIMITS.soft.size) {
        setErrorState('SIZE_WARNING')
        setFile(file)
      } else {
        setErrorState(null)
        setFile(file)
      }
    },
    [setFile]
  )

  const preventClickingWhileFull = useCallback(
    e => {
      if (file) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [file]
  )

  const cancelUpload = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      setErrorState(null)
      setFile(null)
    },
    [setFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: MODEL_FILE_EXTS,
  })

  return (
    <div {...getRootProps({ onClick: preventClickingWhileFull })}>
      <input {...getInputProps({ multiple: false })} />
      <UploadFrame dragactive={isDragActive} currentFile={file}>
        {showError ? (
          <div className={c.Uploader_FlexColumn}>
            <div className={c.Uploader_IconButton} onClick={cancelUpload}>
              <ErrorIcon className={c.Uploader_ErrorIcon} />
            </div>

            <div className={c.Uploader_InfoMessage}>
              Sorry, an unexpected error occurred. Please wait a moment and try to save
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
            {errorState === 'SIZE_WARNING' && (
              <div
                className={classnames(
                  c.Uploader_SmallInfoMessage,
                  c.Uploader_InfoMessage
                )}
              >
                Notice: Files over {FILE_SIZE_LIMITS.soft.pretty} may take a long time to
                upload & process.
              </div>
            )}
          </div>
        ) : errorState === 'TOO_BIG' ? (
          <div className={c.Uploader_FlexColumn}>
            <div className={c.Uploader_IconButton} onClick={cancelUpload}>
              <ExitIcon />
            </div>
            <ErrorIcon className={c.Uploader_ErrorIcon} />
            <div className={c.Uploader_InfoMessage}>
              File over {FILE_SIZE_LIMITS.hard.pretty}. Try uploading a different file.
            </div>
          </div>
        ) : errorState === 'FILE_EXT' ? (
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
              or <span className={c.Uploader_LinkColor}>browse</span> to choose file to
              choose file
            </div>
          </div>
        )}
        <div className={classnames(c.Uploader_InfoMessage, c.Uploader_SmallInfoMessage)}>
          Files can be up to {FILE_SIZE_LIMITS.hard.pretty} each. Files above{' '}
          {FILE_SIZE_LIMITS.soft.pretty} may take longer to upload and process.
        </div>
      </UploadFrame>
    </div>
  )
}

export default Uploader
