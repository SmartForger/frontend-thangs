import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'

import { OverlayWrapper, Spinner } from '@components'
import PartInfo from './PartInfo'
import UploadModels from './UploadModels'
import * as types from '@constants/storeEventTypes'
import { ERROR_STATES, FILE_SIZE_LIMITS, MODEL_FILE_EXTS } from '@constants/fileUpload'
import { track } from '@utilities/analytics'
import AssemblyInfo from './AssemblyInfo'
import { useOverlay } from '@hooks'
import { useIsFeatureOn } from '@hooks/useExperiments'

const NewModelUpload = ({
  activeNode,
  errorMessage,
  uploadFilesData,
  activeFormData,
  isLoading,
  isLastFile,
  multipartName,
  handleContinue,
  handleUpdate,
  setErrorMessage,
  treeData,
}) => {
  return activeNode.isAssembly ? (
    <AssemblyInfo
      activeNode={activeNode}
      errorMessage={errorMessage}
      filesData={uploadFilesData}
      formData={activeFormData}
      onContinue={handleContinue}
      setErrorMessage={setErrorMessage}
      treeData={treeData}
    />
  ) : (
    <PartInfo
      activeNode={activeNode}
      errorMessage={errorMessage}
      filesData={uploadFilesData}
      formData={activeFormData}
      isLoading={isLoading}
      isLastFile={isLastFile}
      multipartName={multipartName}
      onContinue={handleContinue}
      onUpdate={handleUpdate}
      setErrorMessage={setErrorMessage}
      treeData={treeData}
    />
  )
}

// New Files being uploaded
// - Multi-upload
// - handles single, multi, and asm models
//
// New Version being upload
// - SinglePart-upload :check:
// - MultiPart-MultiPartUpload :wip:
// -
//
// Add Part
// - Multi-upload
//
const MultiUpload = ({
  initData = null, //This is used for when files have pre-uploaded before this overlay shows
  previousVersionModelId, //This was previously used for v1 versioning, however behaves like forking
  folderId = '', //preselected folder
  versionData, //actionType = string, modelId (req), partId (opt)
}) => {
  const {
    dispatch,
    license = {},
    uploadModelFiles = {},
    model = {},
  } = useStoreon('license', 'uploadModelFiles', 'model')
  const {
    data: uploadFilesData = {},
    treeData,
    formData,
    isLoading,
    validating,
    validated,
    isAssembly,
  } = uploadModelFiles
  const { isLoading: isLoadingLicense } = license
  const { data: modelData = {}, isLoading: isLoadingModel } = model
  const [activeView, setActiveView] = useState(-1)
  const [errorMessage, setErrorMessage] = useState(null)
  const [warningMessage, setWarningMessage] = useState(null)
  const [allTreeNodes, setAllTreeNodes] = useState([])
  const [singlePartsCount, setSinglePartsCount] = useState(0)
  const multipartName = formData['multipart'] && formData['multipart'].name
  const { setOverlay, setOverlayOpen } = useOverlay()
  const history = useHistory()
  const modelPageFeatureEnabled = useIsFeatureOn('mythangs_model_page_feature')

  const uploadedFiles = useMemo(
    () => Object.values(uploadFilesData).filter(file => file.name && !file.isError),
    [uploadFilesData]
  )
  const allFilesUploaded = useMemo(
    () => uploadedFiles.every(file => !file.isLoading),
    [uploadedFiles]
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
  const activeNode = useMemo(
    () => allTreeNodes[activeView] || null,
    [allTreeNodes, activeView]
  )
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

  const isFile = async file => {
    return new Promise(resolve => {
      const NOT_FOUND_ERROR = 'NotFoundError'
      const reader = new FileReader()
      reader.onloadend = () => {
        // If we know the file type, then it's an actual file
        if (file.type !== '') {
          resolve(true)

          // This occurs when the file viewer confuses a folder for a file based on the extension in the file name
        } else if (reader.error && reader.error.name === NOT_FOUND_ERROR) {
          resolve(false)
        } else {
          resolve(true)
        }
      }

      reader.readAsBinaryString(file)
    })
  }

  const onDrop = useCallback(
    async (acceptedFiles, [rejectedFile], _event) => {
      setErrorMessage()
      const files = (
        await Promise.all(
          acceptedFiles.map(async file => {
            const ext = `.${file.name.split('.').slice(-1)[0].toLowerCase()}`

            const isAFile = await isFile(file)
            if (!isAFile) {
              setErrorMessage(
                `${file.name} appears to be a folder instead of a valid ${ext} file. Please remove the extension from the folder name and retry your upload.`
              )
              return null
            }

            if (!MODEL_FILE_EXTS.includes(ext)) {
              setErrorMessage(
                `${file.name} is not a supported file type.
              Supported file extensions include ${MODEL_FILE_EXTS.map(
          e => ' ' + e.replace('.', '')
        )}.`
              )
              return null
            }

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
        )
      ).filter(f => !!f)

      track('MultiUpload - OnDrop', { amount: files && files.length })

      dispatch(types.UPLOAD_FILES, {
        files,
        modelId: (versionData && versionData.modelId) || null,
      })

      // dispatch(types.GET_UPLOAD_COMPARE_ID, {
      //   files,
      //   modelId: (versionData && versionData.modelId) || null,
      // })

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
    [dispatch, versionData]
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
      onFinish: ({ folderId, modelIds }) => {
        closeOverlay()
        dispatch(types.RESET_UPLOAD_FILES)
        if (modelPageFeatureEnabled) {
          history.push(`/mythangs/file/${modelIds[0]}`)
        } else {
          history.push(folderId ? `/mythangs/folder/${folderId}` : '/mythangs/all-files')
        }
      },
    })
  }, [uploadedFiles, dispatch, closeOverlay, history, modelPageFeatureEnabled])

  const handleContinue = useCallback(
    ({ applyRemaining, data }) => {
      if (errorMessage || isLoading || isLoadingLicense) {
        return
      }

      if (versionData) {
        //Single Part and Selected Part of Multi/asm flow
        // dispatch(types.GET_UPLOAD_COMPARE_ID, {})
        if (modelData?.parts?.length === 1 || versionData?.partId) {
          const currentFileKey = Object.keys(uploadFilesData)[0]
          const currentFile = uploadFilesData[currentFileKey]
          const singlePart = versionData?.partId || modelData?.parts[0].partIdentifier

          dispatch(types.SET_MODEL_INFO, {
            id: currentFile.id,
            formData: {
              previousParts: [singlePart],
            },
          })

          setOverlay({
            isOpen: true,
            template: 'reviewVersion',
            data: {
              animateIn: false,
              windowed: true,
              dialogue: true,
            },
          })
        } else {
          //Multipart - no part pre-selected
          setOverlay({
            isOpen: true,
            template: 'selectPartToVersion',
            data: {
              animateIn: false,
              windowed: true,
              dialogue: true,
              fileIndex: 0,
            },
          })
        }
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
      errorMessage,
      isLoading,
      isLoadingLicense,
      versionData,
      allTreeNodes,
      modelData,
      uploadFilesData,
      dispatch,
      setOverlay,
      activeView,
      previousVersionModelId,
      submitModels,
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
    if (initData) onDrop(initData.acceptedFiles, initData.rejectedFile, initData.e)
    if (versionData && versionData.modelId) {
      dispatch(types.SET_IS_VERSIONING, { isVersioningUpload: true })
      dispatch(types.FETCH_MODEL, { id: versionData.modelId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const overlayHeader = useMemo(() => {
    return !activeNode
      ? previousVersionModelId || versionData
        ? 'Upload New Version'
        : 'Upload Files'
      : activeNode.isAssembly && activeNode.parentId
        ? 'Sub Assembly'
        : activeNode.isAssembly
          ? 'New Assembly'
          : partFormTitle
  }, [activeNode, partFormTitle, previousVersionModelId, versionData])

  const isMultiple = useMemo(() => {
    if (versionData) {
      if (versionData?.partId || modelData?.parts?.length === 1) {
        return false
      }
    }
    return true
  }, [versionData, modelData])

  return (
    <OverlayWrapper
      dataCy={'multi-upload-overlay'}
      isLoading={isLoading || isLoadingLicense}
      onBack={activeView > -1 && handleBack}
      onCancel={uploadedFiles.length > 0 && handleCancelUploading}
      onClose={handleCancelUploading}
      onContinue={allFilesUploaded && handleContinue}
      overlayHeader={overlayHeader}
      cancelText={'Cancel'}
      hideButtons={activeNode}
    >
      {isLoadingModel ? (
        <Spinner />
      ) : !activeNode ? (
        <UploadModels
          allTreeNodes={allTreeNodes}
          errorMessage={errorMessage}
          isAssembly={isAssembly}
          multiple={isMultiple}
          onDrop={onDrop}
          onRemoveNode={removeFile}
          setErrorMessage={setErrorMessage}
          setIsAssembly={setIsAssembly}
          setWarningMessage={setWarningMessage}
          showAssemblyToggle={validated && singlePartsCount > 1 && !versionData}
          uploadFiles={uploadFilesData}
          uploadTreeData={uploadTreeData}
          validated={validated}
          validating={validating}
          versionData={versionData && modelData}
          warningMessage={warningMessage}
        />
      ) : (
        <NewModelUpload
          activeNode={activeNode}
          errorMessage={errorMessage}
          uploadFilesData={uploadFilesData}
          activeFormData={activeFormData}
          isLoading={isLoading}
          isLastFile={activeView === allTreeNodes.length - 1}
          multipartName={multipartName}
          handleContinue={handleContinue}
          handleUpdate={handleUpdate}
          setErrorMessage={setErrorMessage}
          treeData={treeData}
        />
      )}
    </OverlayWrapper>
  )
}

export default MultiUpload
