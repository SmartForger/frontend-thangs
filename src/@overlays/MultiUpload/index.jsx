import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { useHistory } from 'react-router-dom'
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

const MultiUpload = ({ initData = null, folderId }) => {
  const { dispatch, folders = {}, shared = {}, uploadFiles = {} } = useStoreon(
    'folders',
    'shared',
    'uploadFiles'
  )
  const {
    data: uploadFilesData = {},
    treeData,
    formData,
    isLoading,
    validating,
    validated,
    isAssembly,
  } = uploadFiles
  const { data: foldersData = [] } = folders
  const { data: sharedData = [] } = shared
  const [activeView, setActiveView] = useState(-1)
  const [errorMessage, setErrorMessage] = useState(null)
  const [warningMessage, setWarningMessage] = useState(null)
  const [allTreeNodes, setAllTreeNodes] = useState([])
  const [singlePartsCount, setSinglePartsCount] = useState(0)
  const c = useStyles({})
  // const history = useHistory()

  const uploadedFiles = useMemo(
    () => Object.values(uploadFilesData).filter(file => file.name && !file.isError),
    [uploadFilesData]
  )
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
    setSinglePartsCount(singleNodes.length);

    const nodesArray = Object.values(newTreeData)
    const formNode = nodeId => {
      const newNode = newTreeData[nodeId] || {}
      newNode.subs = nodesArray
        .filter(
          node =>
            node.parentId === nodeId || (nodeId === 'multipart' && node.parentId === null)
        )
        .map(subnode => formNode(subnode.id))

      newNode.treeValid =
        newNode.valid &&
        (newNode.subs.length === 0 || newNode.subs.every(subnode => subnode.treeValid))

      return newNode
    }

    let trees = formNode('').subs

    if (isAssembly) {
      singleNodes.forEach(node => {
        node.parentId = 'multipart'
      })
      const multipartNode = {
        id: 'multipart',
        name: 'Multi Part Model',
        valid: true,
        treeValid: true,
        isAssembly: true,
        parentId: '',
        subs: singleNodes,
      }
      trees.push(multipartNode)
      nodesArray.splice(-singleNodes.length, 0, multipartNode)
    } else {
      trees = [...trees, ...singleNodes]
    }

    setAllTreeNodes(nodesArray)

    return trees
  }, [uploadFilesData, treeData, isAssembly])
  const activeNode = useMemo(() => allTreeNodes[activeView] || null, [
    allTreeNodes,
    activeView,
  ])
  const activeFormData = useMemo(() => {
    if (!activeNode) return null

    if (formData[activeNode.id]) {
      return formData[activeNode.id]
    }

    const initialFormData = { name: activeNode.name, folderId: 'files' }
    if (formData[activeNode.parentId]) {
      initialFormData.folderId = formData[activeNode.parentId].folderId
    }

    return initialFormData
  }, [activeNode, formData])
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

    const folderOptions = combinedArray.map(folder => ({
      value: folder.id,
      label: folder.name.replace(new RegExp('//', 'g'), '/'),
      isPublic: folder.isPublic,
    }))

    return [
      {
        value: 'files',
        label: 'My Public Files',
        isPublic: true,
      },
      ...folderOptions,
    ]
  }, [foldersData, sharedData])

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

  const removeFile = node => {
    track('MultiUpload - Remove File')
    dispatch(types.CANCEL_UPLOAD, { node })
  }

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const setIsAssembly = isAssembly => {
    dispatch(types.SET_IS_ASSEMBLY, { isAssembly })
  }

  const handleUpdate = (id, data) => {
    dispatch(types.SET_MODEL_INFO, { id, formData: data })
  }

  const submitModels = useCallback(() => {
    track('MultiUpload - Submit Files', {
      amount: uploadedFiles.length,
    })
    dispatch(types.SUBMIT_MODELS, {
      onFinish: () => {
        closeOverlay()
        dispatch(types.RESET_UPLOAD_FILES)
        // history.push(
        //   assemblyData && assemblyData.folderId && assemblyData.folderId !== 'files'
        //     ? `/mythangs/folder/${assemblyData.folderId}`
        //     : '/mythangs/all-files'
        // )
      },
    })
  }, [uploadedFiles, dispatch, closeOverlay])

  const handleContinue = useCallback(
    ({ applyRemaining, data }) => {
      let i
      for (i = activeView + 1; i < allTreeNodes.length; i++) {
        if (allTreeNodes[i].valid) {
          setActiveView(i)
          break
        }
      }
      if (i === allTreeNodes.length) {
        submitModels()
      }
    },
    [activeView, allTreeNodes, submitModels]
  )

  const handleBack = useCallback(() => {
    let i
    for (i = activeView - 1; i >= 0; i--) {
      if (allTreeNodes[i].valid) {
        setActiveView(i)
        break
      }
    }
    if (i < 0) {
      setActiveView(-1)
    }
    setErrorMessage(null)
  }, [activeView, allTreeNodes])

  const handleCancelUploading = () => {
    closeOverlay()
    dispatch(types.RESET_UPLOAD_FILES)
  }

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
              {!activeNode
                ? 'Upload Files'
                : activeNode.isAssembly
                ? 'New Assembly'
                : 'Enter Information'}
            </SingleLineBodyText>
            {activeView > -1 && (
              <ArrowLeftIcon className={c.MultiUpload_BackButton} onClick={handleBack} />
            )}
            <ExitIcon className={c.MultiUpload_ExitButton} onClick={closeOverlay} />
          </div>
          <Spacer size={'1.5rem'} />
        </div>
        {!activeNode ? (
          <UploadModels
            uploadFiles={uploadFilesData}
            uploadTreeData={uploadTreeData}
            allTreeNodes={allTreeNodes}
            onDrop={onDrop}
            onRemoveNode={removeFile}
            onCancel={handleCancelUploading}
            onContinue={handleContinue}
            setErrorMessage={setErrorMessage}
            setWarningMessage={setWarningMessage}
            errorMessage={errorMessage}
            warningMessage={warningMessage}
            isAssembly={isAssembly}
            setIsAssembly={setIsAssembly}
            validating={validating}
            showAssemblyToggle={validated && singlePartsCount > 1}
          />
        ) : activeNode.isAssembly ? (
          <AssemblyInfo
            activeNode={activeNode}
            formData={activeFormData}
            treeData={treeData}
            folders={dropdownFolders}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            onContinue={handleContinue}
            onUpdate={handleUpdate}
          />
        ) : (
          <PartInfo
            activeNode={activeNode}
            formData={activeFormData}
            treeData={treeData}
            filesData={uploadFilesData}
            folders={dropdownFolders}
            isLoading={isLoading}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            onContinue={handleContinue}
            onUpdate={handleUpdate}
          />
        )}
        <Spacer size={'2rem'} className={c.MultiUpload__desktop} />
      </div>
      <Spacer size={'2rem'} />
    </div>
  )
}

export default MultiUpload
