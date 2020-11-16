import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as R from 'ramda'
import axios from 'axios'
import { SingleLineBodyText, Spacer, Spinner } from '@components'
import EnterInfo from './EnterInfo'
import UploadModels from './UploadModels'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { ERROR_STATES, FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import { track } from '@utilities/analytics'
import { cancelUpload } from '@services'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    MultiUpload: {
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden auto',
      borderRadius: '0',
      backgroundColor: theme.colors.white[300],

      [md]: {
        width: '27.75rem',
        minHeight: '27.75rem',
        borderRadius: '1rem',
      },
    },
    MultiUpload_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
    },
    MultiUpload_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    MultiUpload_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
      background: 'white',
    },
    MultiUpload_BackButton: {
      top: '1.5rem',
      left: '1.5rem',
      cursor: 'pointer',
      zIndex: 4,
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
      width: '100%',
      height: '100%',
      borderRadius: '0',
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: 5,
      display: 'flex',
      [md]: {
        borderRadius: '1rem',
      },
    },
  }
})

const MultiUpload = ({ initData = null, folderId }) => {
  const { dispatch, folders = {}, shared = {}, uploadFiles = {} } = useStoreon(
    'folders',
    'shared',
    'uploadFiles'
  )
  const { data: rawUploadFilesData = {}, isLoading } = uploadFiles
  const { data: foldersData = [] } = folders
  const { data: sharedData = [] } = shared
  const [activeView, setActiveView] = useState('upload')
  const [errorMessage, setErrorMessage] = useState(null)
  const [warningMessage, setWarningMessage] = useState(null)
  const c = useStyles({})
  const history = useHistory()
  // const cancelTokenRef = useRef(axios.CancelToken.source())
  const uploadFilesData = {}
  Object.keys(rawUploadFilesData).forEach(fileDataId => {
    if (rawUploadFilesData[fileDataId].name)
      uploadFilesData[fileDataId] = rawUploadFilesData[fileDataId]
  })
  const handleFileUpload = useCallback(
    (file, errorState, fileId) => {
      if (R.isNil(file)) {
        return
      } else {
        dispatch(types.UPLOAD_FILE, {
          id: fileId,
          file,
          errorState,
          // cancelToken: cancelTokenRef.current.token,
        })
      }
    },
    [dispatch]
  )

  const onDrop = useCallback(
    (acceptedFiles, [rejectedFile], _event) => {
      track('MultiUpload - OnDrop', { amount: acceptedFiles && acceptedFiles.length })
      acceptedFiles.forEach(file => {
        const fileId = Math.random().toString(36).substr(2, 9)
        if (file.size >= FILE_SIZE_LIMITS.hard.size) {
          setErrorMessage(
            `One or more files was over ${FILE_SIZE_LIMITS.hard.pretty}. Try uploading a different file.`
          )
        } else if (file.size >= FILE_SIZE_LIMITS.soft.size) {
          handleFileUpload(file, { warning: ERROR_STATES.SIZE_WARNING }, fileId)
        } else {
          handleFileUpload(file, null, fileId)
        }
      })
      if (rejectedFile) {
        const filePath = rejectedFile.path.split('.')
        const fileExt = filePath[filePath.length - 1] || ''
        track('MultiUpload - Rejected', { fileType: fileExt })
        setErrorMessage(
          `One or more files not supported. Supported file extensions include ${MODEL_FILE_EXTS.map(
            e => e + ' '
          )}.`
        )
      }
    },
    [handleFileUpload]
  )

  const removeFile = useCallback(
    index => {
      track('MultiUpload - Remove File')
      // dispatch(types.REMOVE_UPLOAD_FILES, { index })
      cancelUpload(index)
    },
    [dispatch]
  )

  const closeOverlay = useCallback(() => {
    // cancelTokenRef.current.cancel('Upload interrupted')
    // dispatch(types.RESET_UPLOAD_FILES)
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleSubmit = useCallback(
    ({ selectedFolderId }) => {
      track('MultiUpload - Submit Files', { amount: Object.keys(uploadFilesData).length })
      dispatch(types.SUBMIT_FILES, {
        onFinish: () => {
          closeOverlay()
          history.push(
            selectedFolderId && selectedFolderId !== 'files'
              ? `/mythangs/folder/${selectedFolderId}`
              : '/mythangs/all-files'
          )
        },
      })
    },
    [closeOverlay, dispatch, history, uploadFilesData]
  )

  const handleContinue = useCallback(
    ({ selectedFolderId }) => {
      const loadingFiles = Object.keys(uploadFilesData).filter(
        id => uploadFilesData[id].isLoading
      )
      if (loadingFiles.length > 0)
        return setErrorMessage('Please wait until all files are processed')
      if (activeView === 'upload') {
        setActiveView(0)
      } else {
        if (activeView === Object.keys(uploadFilesData).length - 1) {
          track('Upload - Continue')
          handleSubmit({ selectedFolderId })
        } else {
          setActiveView(activeView + 1)
        }
      }
    },
    [activeView, handleSubmit, uploadFilesData]
  )

  const handleBack = useCallback(() => {
    setErrorMessage(null)
    if (activeView === 'upload') return
    if (activeView === 0) {
      setActiveView('upload')
    } else {
      setActiveView(activeView - 1)
    }
  }, [activeView])

  const handleUpdate = useCallback(
    ({ id, data }) => {
      const newData = { ...data }
      if (newData.folderId === 'files') newData.folderId = null
      dispatch(types.CHANGE_UPLOAD_FILE, { id, data: newData })
    },
    [dispatch]
  )

  const dropdownFolders = useMemo(() => {
    const foldersArray = [...foldersData]
    const sharedArray = [...sharedData]
    const combinedArray = []
    foldersArray.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
    sharedArray.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
    foldersArray.forEach(folder => {
      combinedArray.push(folder)
      folder.subfolders.forEach(subfolder => {
        combinedArray.push(subfolder)
      })
    })
    sharedArray.forEach(folder => {
      combinedArray.push(folder)
    })
    return combinedArray
  }, [foldersData, sharedData])

  useEffect(() => {
    // dispatch(types.RESET_UPLOAD_FILES)
    const { data: folderData } = folders
    if (R.isEmpty(folderData)) {
      dispatch(types.FETCH_THANGS, {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Spacer width={'2rem'} />
      <div className={c.MultiUpload_Content}>
        <div className={c.MultiUpload_Column}>
          <Spacer size={'1.5rem'} />
          <div className={c.MultiUpload_Row}>
            <SingleLineBodyText className={c.MultiUpload_OverlayHeader}>
              {activeView === 'upload' ? 'Upload Files' : 'Enter Information'}
            </SingleLineBodyText>
            {activeView !== 'upload' && (
              <ArrowLeftIcon className={c.MultiUpload_BackButton} onClick={handleBack} />
            )}
            <ExitIcon className={c.MultiUpload_ExitButton} onClick={closeOverlay} />
          </div>
          <Spacer size={'1.5rem'} />
        </div>
        {activeView === 'upload' ? (
          <UploadModels
            closeOverlay={closeOverlay}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            handleContinue={handleContinue}
            onDrop={onDrop}
            removeFile={removeFile}
            uploadFiles={uploadFilesData}
          />
        ) : (
          <EnterInfo
            activeView={activeView}
            closeOverlay={closeOverlay}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            folders={dropdownFolders}
            folderId={folderId}
            handleContinue={handleContinue}
            handleSkipToEnd={handleSubmit}
            handleUpdate={handleUpdate}
            uploadFiles={uploadFilesData}
            isLoading={isLoading}
          />
        )}
      </div>
      <Spacer width={'2rem'} />
    </div>
  )
}

export default MultiUpload
