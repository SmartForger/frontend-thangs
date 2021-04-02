import * as types from '@constants/storeEventTypes'
import { api, uploadFiles, cancelUpload } from '@services'
import { track } from '@utilities/analytics'
import { sleep } from '@utilities'

const getInitAtom = () => ({
  isLoading: false,
  isError: false,
  data: {},
  formData: {},
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
    uploadAttachmentFiles: getInitAtom(),
  }))

  store.on(types.RESET_UPLOAD_FILES, () => ({
    uploadAttachmentFiles: getInitAtom(),
  }))

  store.on(types.SUBMITTING_ATTACHMENTS, state => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        isLoading: true,
      },
    }
  })

  store.on(types.SUBMIT_ATTACHMENTS_FAILED, state => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        isLoading: false,
        isError: true,
      },
    }
  })

  store.on(types.REMOVE_UPLOAD_ATTACHMENT_FILE, (state, { nodeFileMap, shouldRemove }) => {
    const { data: uploadedFiles } = state.uploadAttachmentFiles

    const newUploadedFiles = { ...uploadedFiles }

    Object.values(nodeFileMap).forEach(fileId => {
      if (fileId) {
        delete newUploadedFiles[fileId]
      }
    })

    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        data: newUploadedFiles,
      },
    }
  })


  store.on(types.INIT_UPLOAD_ATTACHMENT_FILES, (state, { files }) => {
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
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        data: {
          ...state.uploadAttachmentFiles.data,
          ...newFilesMap,
        },
      },
    }
  })

  store.on(types.SET_UPLOADED_ATTACHMENT_URLS, (state, { fileIds, uploadedUrlData }) => {
    const { data: uploadedFiles } = state.uploadAttachmentFiles

    fileIds.forEach((fileId, i) => {
      uploadedFiles[fileId] = {
        ...uploadedFiles[fileId],
        ...uploadedUrlData[i],
      }
    })
  })

  store.on(types.CHANGE_UPLOAD_ATTACHMENT_FILE, (state, { id, data, isLoading, isError }) => {
    if (!id || !state.uploadAttachmentFiles.data[id]) {
      return { uploadAttachmentFiles: state.uploadAttachmentFiles }
    }

    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        data: {
          ...state.uploadAttachmentFiles.data,
          [id]: { ...state.uploadAttachmentFiles.data[id], ...data, isLoading, isError },
        },
      },
    }
  })

  store.on(types.SET_ATTACHMENT_INFO, (state, { id, formData }) => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        formData: {
          ...state.uploadAttachmentFiles.formData,
          [id]: formData,
        },
      },
    }
  })

  store.on(types.UPLOAD_ATTACHMENT_FILES, async (state, { files }) => {
    if (!files || files.length === 0) {
      return
    }

    let allFiles = Object.values(state.uploadAttachmentFiles.data)
    let oldFile = allFiles.find(f => f.newFileName)
    while (allFiles.length > 0 && !oldFile) {
      await sleep(500)
      allFiles = Object.values(state.uploadAttachmentFiles.data)
      oldFile = allFiles.find(f => f.newFileName)
    }

    store.dispatch(types.INIT_UPLOAD_ATTACHMENT_FILES, { files })

    if (oldFile) {
      const [directory] = oldFile.newFileName.split('/')
      uploadFiles(files, directory)
      return
    }

    uploadFiles(files)
  })

  store.on(types.SUBMIT_ATTACHMENTS, async (state, { onFinish = noop }) => {
    store.dispatch(types.SUBMITTING_MODELS)

    const { data: uploadedFiles, treeData, formData, isAssembly } = state.uploadAttachmentFiles

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
      store.dispatch(types.FETCH_THANGS, { onFinish })
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
}
