import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as R from 'ramda'
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
import { checkTreeMissing } from '@utilities'
import AssemblyInfo from './AssemblyInfo'

const useStyles = createUseStyles(theme => {
  return {
    MultiUpload: {
      width: '27.75rem',
      minHeight: '27.75rem',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      padding: '2rem',
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
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: 5,
      borderRadius: '1rem',
      display: 'flex',
    },
  }
})

const uploadViews = {
  upload: {
    title: 'Upload Files',
  },
  assemblyInfo: {
    title: 'New Assembly',
  },
  enterInfo: {
    title: 'Enter Information',
  },
}

const MultiUpload = ({ initData = null, folderId }) => {
  const { dispatch, folders = {}, shared = {}, uploadFiles = {} } = useStoreon(
    'folders',
    'shared',
    'uploadFiles'
  )
  const {
    data: uploadFilesData = {},
    validationTree,
    isLoading,
    validating,
    validated,
    isAssembly,
    assemblyData,
  } = uploadFiles
  const { data: foldersData = [] } = folders
  const { data: sharedData = [] } = shared
  const [activeView, setActiveView] = useState('upload')
  const [activeStep, setActiveStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [warningMessage, setWarningMessage] = useState(null)
  const c = useStyles({})
  const history = useHistory()

  const uploadTreeData = useMemo(() => {
    const files = Object.values(uploadFilesData)
    const addTreeLoading = node => {
      const file = files.find(f => f.name === node.name)
      const result = {
        name: node.name,
        isAssembly: node.isAssembly,
        valid: node.valid,
        skipped: node.skipped,
        loading: file && file.isLoading,
      }

      if (node.subs) {
        result.subs = node.subs.map(subnode => addTreeLoading(subnode))
      }
      return result
    }

    if (validationTree && validationTree.length > 0) {
      return validationTree.map(node => addTreeLoading(node))
    } else {
      return files.map(file => ({
        name: file.name,
        isAssembly: false,
        valid: !file.isError,
        loading: file.isLoading,
      }))
    }
  }, [uploadFilesData, validationTree])

  const setAssemblyFormData = formData => {
    console.log('1111', formData)
    dispatch(types.SET_ASSEMBLY_FORMDATA, { formData })
  }

  const onDrop = useCallback((acceptedFiles, [rejectedFile], _event) => {
    track('MultiUpload - OnDrop', { amount: acceptedFiles && acceptedFiles.length })

    const files = acceptedFiles
      .map(file => {
        const fileObj = {
          id: Math.random().toString(36).substr(2, 9),
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

    dispatch(types.UPLOAD_FILES, { files })

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
  })

  const removeFile = filename => {
    track('MultiUpload - Remove File')
    dispatch(types.CANCEL_UPLOAD, { filename })
  }

  const skipFile = filename => {
    track('MultiUpload - Skip File')
    dispatch(types.SKIP_MISSING_FILE, { filename })
  }

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  })

  const setIsAssembly = isAssembly => {
    dispatch(types.SET_IS_ASSEMBLY, { isAssembly })
  }

  const continueToNextStep = useCallback(() => {
    const loadingFiles = Object.keys(uploadFilesData).filter(
      id => uploadFilesData[id].isLoading
    )
    if (loadingFiles.length > 0) {
      return setErrorMessage('Please wait until all files are processed')
    }
    if (validating) {
      return setErrorMessage('Please wait until all files are validated')
    }
    const hasMissingFile =
      !validationTree || validationTree.some(node => checkTreeMissing(node))
    if (hasMissingFile) {
      return setErrorMessage('Please handle all missing files')
    }

    setActiveView(isAssembly ? 'assemblyInfo' : 'enterInfo')
  }, [uploadFilesData, validationTree, isAssembly, validating])

  const continueToModelInfo = ({ data }) => {
    console.log('2222', data)
    setAssemblyFormData(data)
    setActiveView('enterInfo')
    setActiveStep(0)
  }

  const handleContinue = useCallback(() => {
    if (activeStep === Object.keys(uploadFilesData).length - 1) {
      console.log('submit models')
      track('MultiUpload - Submit Files', {
        amount: Object.keys(uploadFilesData).length,
      })
      dispatch(types.SUBMIT_MODELS, {
        onFinish: () => {
          closeOverlay()
          dispatch(types.RESET_UPLOAD_FILES)
          history.push(
            assemblyData && assemblyData.folderId && assemblyData.folderId !== 'files'
              ? `/mythangs/folder/${assemblyData.folderId}`
              : '/mythangs/all-files'
          )
        },
      })
    } else {
      setActiveStep(activeStep + 1)
    }
  }, [activeStep, uploadFilesData, dispatch, closeOverlay, history, assemblyData])

  const handleBack = useCallback(() => {
    setErrorMessage(null)
    if (activeView === 'upload') return
    if (activeView === 'assemblyInfo') {
      setActiveView('upload')
    } else if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    } else {
      setActiveView(isAssembly ? 'assemblyInfo' : 'upload')
    }
  }, [activeView, activeStep, isAssembly])

  const handleUpdate = ({ id, data }) => {
    const newData = { ...data }
    if (newData.folderId === 'files') newData.folderId = null
    dispatch(types.CHANGE_UPLOAD_FILE, { id, data: newData })
  }

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
      <div className={c.MultiUpload_Content}>
        <div className={c.MultiUpload_Column}>
          <Spacer size={'1.5rem'} />
          <div className={c.MultiUpload_Row}>
            <SingleLineBodyText className={c.MultiUpload_OverlayHeader}>
              {uploadViews[activeView].title}
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
            handleContinue={continueToNextStep}
            onDrop={onDrop}
            removeFile={removeFile}
            uploadFiles={uploadFilesData}
            uploadTreeData={uploadTreeData}
            isAssembly={isAssembly}
            setIsAssembly={setIsAssembly}
            skipFile={skipFile}
            validating={validating}
            showAssemblyToggle={
              validated && (!validationTree || validationTree.length === 0)
            }
          />
        ) : activeView === 'assemblyInfo' ? (
          <AssemblyInfo
            formData={assemblyData}
            folders={dropdownFolders}
            folderId={folderId}
            setErrorMessage={setErrorMessage}
            handleContinue={continueToModelInfo}
          />
        ) : (
          <EnterInfo
            activeStep={activeStep}
            closeOverlay={closeOverlay}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            folders={dropdownFolders}
            folderId={(assemblyData && assemblyData.folderId) || folderId}
            handleContinue={handleContinue}
            handleUpdate={handleUpdate}
            uploadFiles={uploadFilesData}
            isLoading={isLoading}
            isAssembly={isAssembly || (validationTree && validationTree.length > 0)}
          />
        )}
      </div>
    </div>
  )
}

export default MultiUpload
