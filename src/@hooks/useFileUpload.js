import { ERROR_STATES, FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const noop = () => null

const useFileUpload = ({
  onSetFile = noop,
  file: initialFile,
  errorState: initialErrorState,
  isExplorerOpened = false,
  noClick = false,
  acceptedFormats = [],
}) => {
  const [file, setFile] = useState(initialFile)
  const [errorState, setErrorState] = useState(initialErrorState)

  const handleSetFileAndState = useCallback(
    (file, errorState) => {
      setFile(file)
      setErrorState(errorState)
      onSetFile(file, errorState)
    },
    [setFile, onSetFile]
  )

  const onDrop = useCallback(
    (acceptedFiles, [rejectedFile], _event) => {
      const [file] = acceptedFiles
      if (rejectedFile) {
        handleSetFileAndState(null, ERROR_STATES.FILE_EXT)
      } else if (file.size >= FILE_SIZE_LIMITS.hard.size) {
        handleSetFileAndState(null, ERROR_STATES.TOO_BIG)
      } else if (file.size >= FILE_SIZE_LIMITS.soft.size) {
        handleSetFileAndState(file, ERROR_STATES.SIZE_WARNING)
      } else {
        handleSetFileAndState(file, null)
      }
    },
    [handleSetFileAndState]
  )

  const cancelUpload = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      setErrorState(null)
      handleSetFileAndState(null, null)
    },
    [handleSetFileAndState]
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
    noClick,
    onDrop,
    accept: acceptedFormats.length ? acceptedFormats : MODEL_FILE_EXTS,
  })

  const UploadZone = useCallback(
    ({ children }) => {
      return (
        <div {...getRootProps({ onClick: preventClickingWhileFull })}>
          <input {...getInputProps({ multiple: false })} name='upload' />
          {children}
        </div>
      )
    },
    [getInputProps, getRootProps, preventClickingWhileFull]
  )

  useEffect(() => {
    if (initialFile) {
      onSetFile(initialFile)
    }
    if (isExplorerOpened) {
      open()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    UploadZone,
    file,
    errorState,
    cancelUpload,
  }
}

export default useFileUpload
