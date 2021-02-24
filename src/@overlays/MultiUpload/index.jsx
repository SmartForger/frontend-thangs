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
import { useHistory } from 'react-router-dom'
import { useOverlay } from '@hooks'

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
      width: '100%',

      [md]: {
        width: '27.75rem',
      },
    },
    MultiUpload_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      minWidth: 0,
    },
    MultiUpload_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    MultiUpload_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    MultiUpload_BackButton: {
      top: '1.5rem',
      left: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
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
      zIndex: '5',
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

const MultiUpload = ({ initData = null, previousVersionModelId, folderId = '' }) => {
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
  const multipartName = formData['multipart'] && formData['multipart'].name
  const { setOverlayOpen } = useOverlay()
  const history = useHistory()

  const uploadedFiles = useMemo(
    () => Object.values(uploadFilesData).filter(file => file.name && !file.isError),
    [uploadFilesData]
  )
  const uploadTreeData = useMemo(() => {
    const keys = Object.keys(treeData)
    const newTreeData = {}
    keys.forEach(key => {
      const file = uploadedFiles.find(f => f.name === treeData[key].filename)
      newTreeData[key] = {
        ...treeData[key],
        loading: file && file.isLoading,
        size: file && file.size,
      }
    })

    const treeNodeFiles = Object.values(treeData).map(node => node.filename)
    const singleNodes = uploadedFiles
      .filter(file => file.name && !file.isError && !treeNodeFiles.includes(file.name))
      .map(file => {
        const id = '/' + file.name
        const result = {
          id,
          name: file.name,
          size: file.size,
          isAssembly: false,
          valid: true,
          treeValid: true,
          parentId: null,
          loading: file.isLoading,
          fileId: file.id,
        }

        if (!isAssembly) {
          newTreeData[id] = result
        }

        return result
      })
    setSinglePartsCount(singleNodes.length)

    let nodesArray = []
    const formNode = nodeId => {
      const newNode = newTreeData[nodeId] || {}
      if (nodeId) {
        nodesArray.push(newNode)
      }
      newNode.subs = nodeId
        ? newNode.subIds
          ? newNode.subIds.map(subId => formNode(subId))
          : []
        : Object.values(newTreeData)
            .filter(node => !node.parentId)
            .map(node => formNode(node.id))

      newNode.treeValid =
        newNode.valid &&
        (newNode.subs.length === 0 || newNode.subs.every(subnode => subnode.treeValid))

      return newNode
    }

    let trees = formNode('').subs

    if (isAssembly) {
      if (singleNodes.length < 2) {
        dispatch(types.SET_IS_ASSEMBLY, { isAssembly: false })
        return singleNodes
      }

      singleNodes.forEach(node => {
        node.parentId = 'multipart'
      })
      const multipartNode = {
        id: 'multipart',
        name: multipartName,
        valid: true,
        treeValid: true,
        isAssembly: true,
        parentId: '',
        subs: singleNodes,
      }
      trees.push(multipartNode)
      nodesArray.push(multipartNode)
      nodesArray = nodesArray.concat(singleNodes)
    }

    setAllTreeNodes(nodesArray)

    return trees
  }, [treeData, uploadedFiles, isAssembly, multipartName, dispatch])
  const activeNode = useMemo(() => allTreeNodes[activeView] || null, [
    allTreeNodes,
    activeView,
  ])
  const activeFormData = useMemo(() => {
    if (!activeNode) return null

    if (formData[activeNode.id]) {
      return formData[activeNode.id]
    }

    const initialFormData = { name: activeNode.name, folderId: folderId }
    if (formData[activeNode.parentId]) {
      initialFormData.folderId = formData[activeNode.parentId].folderId
    }

    return initialFormData
  }, [activeNode, folderId, formData])
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
        value: '',
        label: 'My Public Files',
        isPublic: true,
      },
      ...folderOptions,
    ]
  }, [foldersData, sharedData])

  const partFormTitle = useMemo(() => {
    if (!activeNode) return ''

    const siblings = allTreeNodes.filter(
      node => !node.isAssembly && node.parentId === activeNode.parentId
    )
    if (siblings.length > 0) {
      const activeIndex = siblings.findIndex(node => node.id === activeNode.id)
      return `New ${activeNode.parentId ? 'Part' : 'Model'} ${
        siblings.length > 1 ? `(${activeIndex + 1}/${siblings.length})` : ''
      }`
    }

    return ''
  }, [activeNode, allTreeNodes])

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
            e => ' ' + e.replace('.', '')
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
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const setIsAssembly = isAssembly => {
    dispatch(types.SET_IS_ASSEMBLY, { isAssembly })
  }

  const handleUpdate = (id, data) => {
    dispatch(types.SET_MODEL_INFO, {
      id,
      formData: {
        ...data,
        previousVersionModelId,
      },
    })
  }

  const submitModels = useCallback(() => {
    const files = []
    if (uploadedFiles && uploadedFiles.length) {
      uploadedFiles.forEach(file => {
        if (!files.includes(file.name)) {
          files.push(file.name)
        }
      })
      track('MultiUpload - Submit Files', {
        amount: files.length,
      })
    }
    dispatch(types.SUBMIT_MODELS, {
      onFinish: () => {
        closeOverlay()
        dispatch(types.RESET_UPLOAD_FILES)
        history.push(
          /*assemblyData && assemblyData.folderId && assemblyData.folderId !== 'files'
            ? `/mythangs/folder/${assemblyData.folderId}`
            : */ '/mythangs/recent-files'
        )
      },
    })
  }, [uploadedFiles, dispatch, closeOverlay, history])

  const handleContinue = useCallback(
    ({ applyRemaining, data }) => {
      if (errorMessage) {
        return
      }

      let i = 0

      if (data) {
        if (applyRemaining) {
          // const parentId = allTreeNodes[activeView].parentId
          for (i = activeView; i < allTreeNodes.length; i++) {
            // if (allTreeNodes[i].parentId !== parentId || allTreeNodes[i].isAssembly) {
            //   break
            // }
            const treeNode = allTreeNodes[i]

            if (treeNode.valid) {
              if (treeNode.isAssembly) {
                dispatch(types.SET_MODEL_INFO, {
                  id: treeNode.id,
                  formData:
                    i === activeView
                      ? data
                      : { description: data.description, name: treeNode.name },
                })
              } else {
                dispatch(types.SET_MODEL_INFO, {
                  id: treeNode.id,
                  formData: i === activeView ? data : { ...data, name: treeNode.name },
                })
              }
            }
          }
        } else {
          i = activeView + 1
          dispatch(types.SET_MODEL_INFO, {
            id: allTreeNodes[activeView].id,
            formData: { ...data, previousVersionModelId },
          })
        }
      }

      for (; i < allTreeNodes.length; i++) {
        if (allTreeNodes[i].valid) {
          setActiveView(i)
          break
        }
      }
      if (i === allTreeNodes.length) {
        setActiveView(i - 1)
        submitModels()
      }
    },
    [
      activeView,
      allTreeNodes,
      dispatch,
      submitModels,
      errorMessage,
      previousVersionModelId,
    ]
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
                ? previousVersionModelId
                  ? 'Upload New Version'
                  : 'Upload Files'
                : activeNode.isAssembly && activeNode.parentId
                ? 'Sub Assembly'
                : activeNode.isAssembly
                ? 'New Assembly'
                : partFormTitle}
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
            validated={validated}
            showAssemblyToggle={validated && singlePartsCount > 1}
            multiple={previousVersionModelId ? false : true}
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
          />
        ) : (
          <PartInfo
            activeNode={activeNode}
            formData={activeFormData}
            treeData={treeData}
            filesData={uploadFilesData}
            multipartName={multipartName}
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
