import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

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

const useFileUpload = ({ handleFile }) => {
  const [file, setFile] = useState(undefined)
  const [errorState, setErrorState] = useState(undefined)

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

  const cancelUpload = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      setErrorState(null)
      setFile(null)
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: MODEL_FILE_EXTS,
  })

  const UploadZone = useCallback(
    ({ children }) => {
      return (
        <div {...getRootProps({ onClick: preventClickingWhileFull })}>
          <input {...getInputProps({ multiple: false })} />
          {children}
        </div>
      )
    },
    [getInputProps, getRootProps, preventClickingWhileFull]
  )

  return {
    errorState,
    cancelUpload,
    isDragActive,
    UploadZone,
    FILE_SIZE_LIMITS,
    MODEL_FILE_EXTS,
  }
}

export default useFileUpload
