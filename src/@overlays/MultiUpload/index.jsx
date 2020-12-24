import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as R from 'ramda'
import { SingleLineBodyText, Spacer, Spinner } from '@components'
import PartInfo from './PartInfo'
import UploadModels from './UploadModels'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { ERROR_STATES, FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import { track } from '@utilities/analytics'
import AssemblyInfo from './AssemblyInfo'

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

      [md]: {
        width: '27.75rem',
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
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: 5,
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

const uploadViews = {
  upload: {
    title: 'Upload Files',
  },
  assemblyInfo: {
    title: 'New Assembly',
  },
  partInfo: {
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
    treeData,
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
  const [allTreeNodes, setAllTreeNodes] = useState([])
  const c = useStyles({})
  const history = useHistory()

  const uploadedFiles = useMemo(
    () => Object.values(uploadFilesData).filter(file => file.name && !file.isError),
    [uploadFilesData]
  )
  const hasAssembly = useMemo(() => Object.values(treeData).length > 0, [treeData])
  const uploadTreeData = useMemo(() => {
    const keys = Object.keys(treeData)
    const newTreeData = {}
    keys.forEach(key => {
      const file = uploadFilesData[treeData[key].name]
      newTreeData[key] = {
        ...treeData[key],
        loading: file && file.isLoading,
      }
    })

    const treeNodeNames = Object.values(treeData).map(node => node.name)
    const singleNodes = Object.values(uploadFilesData)
      .filter(file => file.name && !file.isError && !treeNodeNames.includes(file.name))
      .map(file => {
        const id = '/' + file.name
        newTreeData[id] = {
          id,
          name: file.name,
          isAssembly: false,
          valid: true,
          treeValid: true,
          parentId: null,
          loading: file.isLoading,
          fileId: file.id,
        }
        return newTreeData[id]
      })

    const nodesArray = Object.values(newTreeData)
    const formNode = nodeId => {
      const subs = nodesArray
        .filter(
          node =>
            node.parentId === nodeId || (nodeId === 'multipart' && node.parentId === null)
        )
        .map(subnode => formNode(subnode.id))
      return newTreeData[nodeId]
        ? {
            ...newTreeData[nodeId],
            subs,
          }
        : { subs }
    }

    let trees = formNode('').subs

    if (isAssembly) {
      trees.push({
        id: 'multipart',
        parentId: '',
        subs: singleNodes,
      })
      nodesArray.splice(-singleNodes.length, 0, {
        id: 'multipart',
        parentId: '',
      })
    } else {
      trees = [...trees, ...singleNodes]
    }

    setAllTreeNodes(nodesArray)

    return trees
  }, [uploadFilesData, treeData, isAssembly])

  const setModelInfo = (id, formData) => {
    dispatch(types.SET_MODEL_INFO, { id, formData })
  }

  const onDrop = useCallback(
    (acceptedFiles, [rejectedFile], _event) => {
      track('MultiUpload - OnDrop', { amount: acceptedFiles && acceptedFiles.length })

      const files = acceptedFiles
        .map(file => {
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
    },
    [dispatch]
  )

  const removeFile = filename => {
    track('MultiUpload - Remove File')
    dispatch(types.CANCEL_UPLOAD, { filename })
  }

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

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

    setActiveView(isAssembly ? 'assemblyInfo' : 'partInfo')
  }, [uploadFilesData, isAssembly, validating])

  const continueToModelInfo = ({ data }) => {
    setModelInfo(data)
    setActiveView('partInfo')
    setActiveStep(0)
  }

  const handleUpdate = useCallback(
    ({ id, data }) => {
      const newData = { ...data }
      if (newData.folderId === 'files') newData.folderId = null
      dispatch(types.CHANGE_UPLOAD_FILE, { id, data: newData })
    },
    [dispatch]
  )

  const submitModels = useCallback(() => {
    track('MultiUpload - Submit Files', {
      amount: uploadedFiles.length,
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
  }, [uploadedFiles.length, dispatch, closeOverlay, history, assemblyData])

  const handleContinue = useCallback(
    ({ applyRemaining, data }) => {
      if (activeStep === uploadedFiles.length - 1) {
        submitModels()
      } else if (applyRemaining) {
        for (let i = activeStep + 1; i < uploadedFiles.length; i++) {
          const newData = { ...data, ...uploadedFiles[i] }
          handleUpdate(newData)
        }
        submitModels()
      } else {
        setActiveStep(activeStep + 1)
      }
    },
    [activeStep, uploadedFiles, handleUpdate, submitModels]
  )

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

  const handleCancelUploading = () => {
    closeOverlay()
    dispatch(types.RESET_UPLOAD_FILES)
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
      <Spacer size={'2rem'} />
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
            uploadFiles={uploadFilesData}
            uploadTreeData={uploadTreeData}
            allTreeNodes={allTreeNodes}
            onDrop={onDrop}
            onRemoveNode={removeFile}
            onCancel={handleCancelUploading}
            onContinue={continueToNextStep}
            setErrorMessage={setErrorMessage}
            setWarningMessage={setWarningMessage}
            errorMessage={errorMessage}
            warningMessage={warningMessage}
            isAssembly={isAssembly}
            setIsAssembly={setIsAssembly}
            validating={validating}
            showAssemblyToggle={validated && !hasAssembly}
          />
        ) : activeView === 'assemblyInfo' ? (
          <AssemblyInfo
            errorMessage={errorMessage}
            folderId={folderId}
            folders={dropdownFolders}
            formData={assemblyData}
            handleContinue={continueToModelInfo}
            isMultipart={!hasAssembly && isAssembly}
            setErrorMessage={setErrorMessage}
            uploadedFiles={uploadedFiles}
          />
        ) : (
          <PartInfo
            activeStep={activeStep}
            closeOverlay={closeOverlay}
            errorMessage={errorMessage}
            folderId={(assemblyData && assemblyData.folderId) || folderId}
            folders={dropdownFolders}
            handleContinue={handleContinue}
            handleUpdate={handleUpdate}
            isAssembly={isAssembly || hasAssembly}
            isLoading={isLoading}
            setErrorMessage={setErrorMessage}
            uploadFiles={uploadFilesData}
          />
        )}
        <Spacer size={'2rem'} className={c.MultiUpload__desktop} />
      </div>
      <Spacer size={'2rem'} />
    </div>
  )
}

export default MultiUpload
