import React from 'react'
import { useDropzone } from 'react-dropzone'
import { ReactComponent as UploadIcon } from '../../@svg/upload-icon.svg'
import { ReactComponent as VersionIcon } from '../../@svg/version.svg'
import { ReactComponent as ErrorIcon } from '../../@svg/error-triangle.svg'
import { ReactComponent as ModelPyramid } from '../../@svg/model-pyramid.svg'
import { ReactComponent as ExitIcon } from '../../@svg/icon-X.svg'
import { UploadFrame } from '../UploadFrame'
import { Button } from '../Button'
import classnames from 'classnames'
import { createUseStyles } from '@style'

export const UPLOAD_MODES = {
  MODEL: 'MODEL',
  VERSION: 'VERSION',
}

const useStyles = createUseStyles(theme => {
  return {
    Uploader: {},
    Uploader_Icon: {
      marginBottom: '2rem',
    },
    Uploader_IconButton: {
      position: 'absolute',
      right: '2rem',
      top: '2rem',
      '& svg': {
        fill: theme.colors.white[900],
        stroke: theme.colors.white[900],
        height: '3rem',
        width: '3rem',
      },
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
      ...theme.mixins.text.linkText,
    },
    Uploader_InfoMessage: {
      ...theme.mixins.text.infoMessageText,
      marginTop: '2rem',
      textAlign: 'center',
      maxWidth: '25rem',
    },
    Uploader_SmallInfoMessage: {
      ...theme.mixins.text.smallInfoMessageText,
    },
  }
})

const MODEL_FILE_EXTS = [
  '.3dxml', // THREE_D_XML
  '.asab', // ACIS_Assembly_Binary
  '.asat', // ACIS_Assembly
  '.CATPart', // CATIAV5
  '.CATProduct', // CATIAV5_Assembly
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
  '.sldasm', // SolidWorks_Assembly
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

export function Uploader({ file, setFile, showError = true, mode = UPLOAD_MODES.MODEL }) {
  const c = useStyles()
  const [errorState, setErrorState] = React.useState()
  const onDrop = React.useCallback(
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

  const preventClickingWhileFull = e => {
    if (file) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const cancelUpload = e => {
    e.preventDefault()
    e.stopPropagation()
    setErrorState(null)
    setFile(null)
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: MODEL_FILE_EXTS,
  })

  const handleBrowseClick = e => {
    e.preventDefault()
  }

  return (
    <div {...getRootProps({ onClick: preventClickingWhileFull })}>
      <input {...getInputProps({ multiple: false })} />
      <UploadFrame dragactive={isDragActive} currentFile={file}>
        {showError ? (
          <div className={c.Uploader_FlexColumn}>
            <Button text className={c.Uploader_IconButton} onClick={cancelUpload}>
              <ErrorIcon className={c.Uploader_ErrorIcon} />
            </Button>

            <div className={c.Uploader_InfoMessage}>
              Sorry, an unexpected error occurred. Please wait a moment and try to save
              the model again.
            </div>
          </div>
        ) : file ? (
          <div className={c.Uploader_FlexColumn}>
            <Button text className={c.Uploader_IconButton} onClick={cancelUpload}>
              <ExitIcon />
            </Button>
            <ModelPyramid />
            <div className={c.Uploader_InfoMessage}>
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
            <Button text className={c.Uploader_IconButton} onClick={cancelUpload}>
              <ExitIcon />
            </Button>
            <ErrorIcon className={c.Uploader_ErrorIcon} />
            <div className={c.Uploader_InfoMessage}>
              File over {FILE_SIZE_LIMITS.hard.pretty}. Try uploading a different file.
            </div>
          </div>
        ) : errorState === 'FILE_EXT' ? (
          <div className={c.Uploader_FlexColumn}>
            <Button text className={c.Uploader_IconButton} onClick={cancelUpload}>
              <ExitIcon />
            </Button>
            <ErrorIcon className={c.Uploader_ErrorIcon} />
            <div className={c.Uploader_InfoMessage}>
              File extension not supported. Supported file extensions include{' '}
              {MODEL_FILE_EXTS.map(e => e + ' ')}.
            </div>
          </div>
        ) : (
          <div className={c.Uploader_FlexColumn}>
            {mode === UPLOAD_MODES.MODEL && <UploadIcon className={c.Uploader_Icon} />}
            {mode === UPLOAD_MODES.VERSION && <VersionIcon className={c.Uploader_Icon} />}
            <div className={c.Uploader_InfoMessage}>
              Drag & Drop model
              <br />
              or{' '}
              <Button text onClick={handleBrowseClick}>
                <span className={c.Uploader_LinkColor}>browse</span>
              </Button>{' '}
              to choose file
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
