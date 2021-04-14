import * as types from '@constants/storeEventTypes'
import { api, uploadFiles, cancelUpload } from '@services'
import { track } from '@utilities/analytics'
import { sleep } from '@utilities'

const getInitAtom = () => ({
  isLoading: false,
  isError: false,
  data: {},
  formData: {},
  treeData: {},
  validating: false,
  validated: false,
  isAssembly: false,
  assemblyData: {},
})

const trackParts = (model, eventName) => {
  const parts = []
  if (model.parts && model.parts.length) {
    model.parts.forEach(part => {
      if (!parts.includes(part.name)) {
        parts.push(part.name)
        track(eventName, { filename: part.name })
      }
    })
  }
}

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadModelFiles: getInitAtom(),
  }))

  store.on(types.RESET_UPLOAD_FILES, () => ({
    uploadModelFiles: getInitAtom(),
  }))

  store.on(types.SUBMITTING_MODELS, state => {
    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        isLoading: true,
      },
    }
  })

  store.on(types.SUBMIT_MODELS_FAILED, state => {
    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        isLoading: false,
        isError: true,
      },
    }
  })

  store.on(types.REMOVE_UPLOAD_FILES, (state, { nodeFileMap, shouldRemove }) => {
    const { data: uploadedFiles, treeData } = state.uploadModelFiles

    const newUploadedFiles = { ...uploadedFiles }

    Object.values(nodeFileMap).forEach(fileId => {
      if (fileId) {
        delete newUploadedFiles[fileId]
      }
    })

    const nodeIds = Object.keys(nodeFileMap)
    const newTreeData = { ...treeData }
    nodeIds.forEach(nodeId => {
      if (shouldRemove) {
        delete newTreeData[nodeId]
      } else if (newTreeData[nodeId]) {
        newTreeData[nodeId].fileId = ''
        newTreeData[nodeId].valid = false
      }
    })

    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        data: newUploadedFiles,
        treeData: newTreeData,
      },
    }
  })

  store.on(types.CANCEL_UPLOAD, (state, { node }) => {
    const { treeData } = state.uploadModelFiles

    const nodeFileMap = {}

    const findNodesToRemove = node => {
      if (!node) {
        return
      }

      nodeFileMap[node.id] = node.fileId
      if (node.subIds) {
        node.subIds.forEach(subnodeId => {
          findNodesToRemove(treeData[subnodeId])
        })
      }
    }

    if (node.id === 'multipart') {
      node.subs.forEach(subnode => {
        nodeFileMap[subnode.id] = subnode.fileId
      })
    } else {
      findNodesToRemove(node)
    }

    cancelUpload(nodeFileMap, !node.parentId)
  })

  store.on(types.INIT_UPLOAD_FILES, (state, { files }) => {
    const newFilesMap = files.reduce(
      (newFiles, f) => ({
        ...newFiles,
        [f.id]: {
          id: f.id,
          name: f.file.name,
          size: f.file.size,
          error: f.errorState && f.errorState.message,
          isLoading: f.errorState && f.errorState.error ? false : true,
          isError: f.errorState && f.errorState.error,
          isWarning: f.errorState && f.errorState.warning,
        },
      }),
      {}
    )

    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        data: {
          ...state.uploadModelFiles.data,
          ...newFilesMap,
        },
        validated: false,
      },
    }
  })

  store.on(types.SET_UPLOADED_URLS, (state, { fileIds, uploadedUrlData }) => {
    const { data: uploadedFiles } = state.uploadModelFiles

    fileIds.forEach((fileId, i) => {
      uploadedFiles[fileId] = {
        ...uploadedFiles[fileId],
        ...uploadedUrlData[i],
      }
    })
  })

  store.on(types.CHANGE_UPLOAD_FILE, (state, { id, data, isLoading, isError }) => {
    if (!id || !state.uploadModelFiles.data[id]) {
      return { uploadModelFiles: state.uploadModelFiles }
    }

    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        data: {
          ...state.uploadModelFiles.data,
          [id]: { ...state.uploadModelFiles.data[id], ...data, isLoading, isError },
        },
      },
    }
  })

  store.on(types.SET_IS_ASSEMBLY, (state, { isAssembly }) => {
    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        isAssembly,
      },
    }
  })

  store.on(types.SET_MODEL_INFO, (state, { id, formData }) => {
    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        formData: {
          ...state.uploadModelFiles.formData,
          [id]: formData,
        },
      },
    }
  })

  store.on(types.VALIDATE_FILES_SUCCESS, (state, { treeData }) => {
    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        treeData,
        validating: false,
        validated: true,
      },
    }
  })

  store.on(types.VALIDATE_FILES_FAILED, state => {
    return {
      uploadModelFiles: {
        ...state.uploadModelFiles,
        treeData: {},
        validating: false,
        validated: true,
      },
    }
  })

  store.on(types.SET_VALIDATING, (state, { validating }) => ({
    uploadModelFiles: {
      ...state.uploadModelFiles,
      validating,
    },
  }))

  store.on(types.VALIDATE_FILES, async state => {
    const { data } = state.uploadModelFiles
    const isLoading = Object.values(data).some(file => file.isLoading)
    if (isLoading) {
      return
    }

    store.dispatch(types.SET_VALIDATING, { validating: true })

    try {
      const { data: responseData } = await api({
        method: 'POST',
        endpoint: 'models/validatefiles',
        body: {
          fileNames: Object.values(data).map(file => file.newFileName),
        },
      })

      const uploadedFiles = Object.values(data).filter(file => !file.isError)
      const newTreeData = {}
      if (responseData.isAssembly !== false) {
        const transformNode = (node1, node2, parentId = '', rootName = '', modelId) => {
          const name = node1.name.split(':')[0]
          const filePaths = node1.filename.split('\\')
          const filename = filePaths[filePaths.length - 1]
          const suffix = Math.random().toString().replace('0.', '')
          const id = rootName + '/' + node1.name + '/' + suffix
          const file = uploadedFiles.find(file => file.name === filename)

          const newNode = {
            aggregatorId: modelId,
            fileId: file ? file.id : '',
            filename,
            id,
            isAssembly: node1.isAssembly,
            name,
            originalPartName: node1.name,
            parentId,
            valid: node2.valid,
          }
          newTreeData[id] = newNode

          if (node1.subs && node1.subs.length > 0) {
            newNode.subIds = node1.subs.map((subnode, i) =>
              transformNode(subnode, node2.subs[i], newNode.id, rootName)
            )
            newNode.subIds.sort((subId1, subId2) => {
              const a = newTreeData[subId1].isAssembly ? 1 : 0
              const b = newTreeData[subId2].isAssembly ? 1 : 0
              return a - b
            })
          } else {
            newNode.subIds = []
          }

          return newNode.id
        }

        responseData.forEach(model => {
          transformNode(
            model.modelDescription,
            model.validation,
            '',
            model.root,
            model.modelId
          )
        })
      }
      store.dispatch(types.VALIDATE_FILES_SUCCESS, {
        treeData: newTreeData,
      })
    } catch (e) {
      store.dispatch(types.VALIDATE_FILES_FAILED)
    }
  })

  store.on(types.UPLOAD_FILES, async (state, { files }) => {
    if (!files || files.length === 0) {
      return
    }

    let allFiles = Object.values(state.uploadModelFiles.data)
    let oldFile = allFiles.find(f => f.newFileName)
    while (allFiles.length > 0 && !oldFile) {
      await sleep(500)
      allFiles = Object.values(state.uploadModelFiles.data)
      oldFile = allFiles.find(f => f.newFileName)
    }

    store.dispatch(types.INIT_UPLOAD_FILES, { files })

    if (oldFile) {
      const [directory] = oldFile.newFileName.split('/')
      uploadFiles(files, directory)
      return
    }

    uploadFiles(files)
  })

  store.on(types.SUBMIT_MODELS, async (state, { onFinish = noop }) => {
    store.dispatch(types.SUBMITTING_MODELS)

    const { data: uploadedFiles, treeData, formData, isAssembly } = state.uploadModelFiles

    const payload = []
    const assemblyGroups = {}
    Object.keys(treeData).forEach(nodeId => {
      if (!treeData[nodeId].valid) return
      const [rootName] = nodeId.split('/')

      if (!assemblyGroups[rootName]) {
        assemblyGroups[rootName] = [nodeId]
      } else {
        assemblyGroups[rootName].push(nodeId)
      }
    })

    const addedFiles = {}
    Object.keys(assemblyGroups).forEach(rootName => {
      const rootNodeId = assemblyGroups[rootName].find(
        nodeId => !treeData[nodeId].parentId
      )
      const { primary: _p, ...info } = formData[rootNodeId] || {}
      addedFiles[treeData[rootNodeId].fileId] = true
      info.aggregatorId = treeData[rootNodeId].aggregatorId
      info.parts = assemblyGroups[rootName].map(nodeId => {
        const { primary: _p, ...partInfo } = formData[nodeId] || {}
        const node = treeData[nodeId]
        const file = uploadedFiles[node.fileId]
        addedFiles[node.fileId] = true
        return {
          ...partInfo,
          originalFileName: file ? file.name : node.filename,
          originalPartName: node.originalPartName,
          filename: file ? file.newFileName : node.filename,
          size: file ? file.size : 0,
          isPrimary: false,
        }
      })

      payload.push(info)
    })

    const remainingFiles = Object.values(uploadedFiles).filter(
      f => f.name && !f.isError && !addedFiles[f.name]
    )
    if (remainingFiles.length > 0) {
      if (isAssembly) {
        const { primary, ...partInfo } = formData['multipart'] || {}

        payload.push({
          ...partInfo,
          parts: remainingFiles.map(file => {
            const nodeId = '/' + file.name

            return {
              ...formData[nodeId],
              originalFileName: file.name,
              originalPartName: file.name,
              filename: file.newFileName,
              size: file.size,
              isPrimary: primary === nodeId,
            }
          }),
        })
      } else {
        remainingFiles.forEach(file => {
          const nodeId = '/' + file.name

          payload.push({
            ...formData[nodeId],
            parts: [
              {
                ...formData[nodeId],
                originalFileName: file.name,
                originalPartName: file.name,
                filename: file.newFileName,
                size: file.size,
                isPrimary: true,
              },
            ],
          })
        })
      }
    }

    payload.forEach(model => {
      track('New Model Upload Attempt')
      trackParts(model, 'New Part Upload Attempt')
    })

    try {
      const { data, error } = await api({
        method: 'POST',
        endpoint: 'models',
        body: payload,
      })
      store.dispatch(types.FETCH_THANGS, {
        onFinish: () => {
          onFinish(payload[0].folderId)
        },
      })
      let eventName = ''
      if (error) eventName = 'Model Uploaded Failed - Error'
      // data should be an array. If the nodeJS timeout hits we will
      // receive an empty object instead. Hitting the nodeJS timeout
      // doesn't necessarily mean the model has failed just taking longer to process - BE
      if (!data || !data.length) eventName = 'Model Uploaded Failed - Empty Object'
      if (eventName !== '') {
        track(eventName, {
          data,
          error,
          payload: JSON.stringify(payload),
        })
        eventName = eventName.replace('Model', 'Part')
        payload.forEach(model => {
          trackParts(model, eventName)
        })
      } else {
        if (data && data.length) {
          data.forEach((model, index) => {
            if (model === null) {
              eventName = 'Model Uploaded Failed - Null Array'
            } else {
              eventName = 'Model Uploaded Succeeded'
            }
            track(eventName, {
              data,
              error,
              payload: JSON.stringify(payload),
            })
            eventName = eventName.replace('Model', 'Part')
            trackParts(payload[index], eventName)
          })
        }
      }
    } catch (e) {
      track('Model Uploaded Error', { error: e })
      store.dispatch(types.SUBMIT_MODELS_FAILED)
    }
  })

  store.on(
    types.SUBMIT_NEW_VERSION,
    async (state, { message, modelId, onFinish = noop, onError = noop }) => {
      store.dispatch(types.SUBMITTING_MODELS)
      const { data: uploadedFiles, formData } = state.uploadFiles
      const events = []
      Object.keys(uploadedFiles).forEach(file => {
        formData[file].previousParts.forEach(part => {
          events.push({
            action: 'replacedPart',
            filename: uploadedFiles[file].newFileName,
            size: uploadedFiles[file].size,
            partIdentifier: part.partIdentifier,
          })
        })
      })

      try {
        const { error } = await api({
          method: 'PUT',
          endpoint: `models/${modelId}`,
          body: {
            message,
            events,
          },
        })
        if (error) {
          onError()
          track('Model Uploaded Error', { error })
          store.dispatch(types.SUBMIT_MODELS_FAILED)
          return
        }
        store.dispatch(types.FETCH_THANGS, {})
        onFinish()
      } catch (e) {
        track('Model Uploaded Error', { error: e })
        store.dispatch(types.SUBMIT_MODELS_FAILED)
      }
    }
  )
}
