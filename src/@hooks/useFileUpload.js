import UploaderContent from '@components/UploaderContent'
import { ERROR_STATES, FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const NOOP = () => null

const useFileUpload = ({ onSetFile = NOOP, initialyOpened = false }) => {
  const [file, setFile] = useState(undefined)
  const [errorState, setErrorState] = useState(undefined)

  const handleSetFile = useCallback(
    file => {
      setFile(file)
      onSetFile(file)
    },
    [setFile, onSetFile]
  )

  const onDrop = useCallback(
    (acceptedFiles, [rejectedFile], _event) => {
      const [file] = acceptedFiles
      if (rejectedFile) {
        setErrorState(ERROR_STATES.FILE_EXT)
        handleSetFile(null)
      } else if (file.size >= FILE_SIZE_LIMITS.hard.size) {
        setErrorState(ERROR_STATES.TOO_BIG)
        handleSetFile(null)
      } else if (file.size >= FILE_SIZE_LIMITS.soft.size) {
        setErrorState(ERROR_STATES.SIZE_WARNING)
        handleSetFile(file)
      } else {
        setErrorState(null)
        handleSetFile(file)
      }
    },
    [handleSetFile]
  )

  const cancelUpload = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      setErrorState(null)
      handleSetFile(null)
    },
    [handleSetFile]
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

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: MODEL_FILE_EXTS,
  })

  const UploadZone = useCallback(
    ({ children, showError }) => {
      return (
        <div {...getRootProps({ onClick: preventClickingWhileFull })}>
          <input {...getInputProps({ multiple: false })} />
          {children ? (
            children
          ) : (
            <UploaderContent
              errorState={errorState}
              file={file}
              cancelUpload={cancelUpload}
              showError={showError}
            />
          )}
        </div>
      )
    },
    [
      getInputProps,
      getRootProps,
      preventClickingWhileFull,
      errorState,
      cancelUpload,
      file,
    ]
  )

  useEffect(() => {
    if (initialyOpened) {
      open()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    UploadZone,
    file,
  }
}

export default useFileUpload
