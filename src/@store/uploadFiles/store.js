import * as types from '@constants/storeEventTypes'
import { api, uploadFiles, cancelUpload } from '@services'

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

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadFiles: getInitAtom(),
  }))

  store.on(types.RESET_UPLOAD_FILES, () => ({
    uploadFiles: getInitAtom(),
  }))

  store.on(types.SUBMITTING_MODELS, state => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        isLoading: true,
      },
    }
  })

  store.on(types.SUBMIT_MODELS_FAILED, state => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        isLoading: false,
        isError: true,
      },
    }
  })

  store.on(types.REMOVE_UPLOAD_FILES, (state, { index }) => {
    const { data: uploadedFiles } = state.uploadFiles

    const newUploadedFiles = { ...uploadedFiles }
    delete newUploadedFiles[index]

    return {
      uploadFiles: {
        ...state.uploadFiles,
        data: newUploadedFiles,
      },
    }
  })

  store.on(types.CANCEL_UPLOAD, (state, { node }) => {
    const { treeData } = state.uploadFiles
    const newTreeData = { ...treeData }

    const cancelNode = (node, shouldRemoveNode) => {
      if (!node) {
        return
      }

      if (newTreeData[node.id]) {
        if (shouldRemoveNode) {
          delete newTreeData[node.id]
        } else {
          newTreeData[node.id] = {
            ...node,
            valid: false,
          }
        }

        if (node.fileId) {
          cancelUpload(node.fileId)
          node.fileId = ''
        }
        node.subIds.forEach(subnodeId =>
          cancelNode(newTreeData[subnodeId], shouldRemoveNode)
        )
      } else if (node.fileId) {
        cancelUpload(node.fileId)
      }
    }

    cancelNode(node, !node.parentId)

    return {
      uploadFiles: {
        ...state.uploadFiles,
        treeData: newTreeData,
      },
    }
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
      uploadFiles: {
        ...state.uploadFiles,
        data: {
          ...state.uploadFiles.data,
          ...newFilesMap,
        },
        validated: false,
      },
    }
  })

  store.on(types.CHANGE_UPLOAD_FILE, (state, { id, data, isLoading, isError }) => {
    if (!id) {
      return { uploadFiles: state.uploadFiles }
    }

    return {
      uploadFiles: {
        ...state.uploadFiles,
        data: {
          ...state.uploadFiles.data,
          [id]: { ...state.uploadFiles.data[id], ...data, isLoading, isError },
        },
      },
    }
  })

  store.on(types.SET_IS_ASSEMBLY, (state, { isAssembly }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        isAssembly,
      },
    }
  })

  store.on(types.SET_MODEL_INFO, (state, { id, formData }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        formData: {
          ...state.uploadFiles.formData,
          [id]: formData,
        },
      },
    }
  })

  store.on(types.VALIDATE_FILES_SUCCESS, (state, { treeData }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        treeData,
        validating: false,
        validated: true,
      },
    }
  })

  store.on(types.VALIDATE_FILES_FAILED, state => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        treeData: {},
        validating: false,
        validated: true,
      },
    }
  })

  store.on(types.SET_VALIDATING, (state, { validating }) => ({
    uploadFiles: {
      ...state.uploadFiles,
      validating,
    },
  }))

  store.on(types.VALIDATE_FILES, async state => {
    const { data } = state.uploadFiles
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
        const transformNode = (node1, node2, parentId = '', rootName = '') => {
          const name = node1.name.split(':')[0]
          const id = rootName + '/' + node1.name
          const file = node2.valid && uploadedFiles.find(file => file.name === name)

          const newNode = {
            id,
            name,
            isAssembly: node1.isAssembly,
            valid: node2.valid,
            parentId,
            fileId: file ? file.id : '',
          }
          newTreeData[id] = newNode

          if (node1.subs && node1.subs.length > 0) {
            newNode.subIds = node1.subs.map((subnode, i) =>
              transformNode(subnode, node2.subs[i], newNode.id, rootName)
            )
          } else {
            newNode.subIds = []
          }

          return newNode.id
        }

        responseData.forEach(model => {
          transformNode(model.modelDescription, model.validation, '', model.root)
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
    store.dispatch(types.INIT_UPLOAD_FILES, { files })

    const { data: uploadedFiles } = state.uploadFiles
    const oldFile = Object.values(uploadedFiles)[0]
    if (oldFile) {
      const [directory] = oldFile.newFileName.split('/')
      uploadFiles(files, directory)
      return
    }

    uploadFiles(files)
  })

  store.on(types.SUBMIT_MODELS, async (state, { onFinish = noop }) => {
    store.dispatch(types.SUBMITTING_MODELS)

    const { data: uploadedFiles, treeData, formData, isAssembly } = state.uploadFiles

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
      const rootNodeId = `${rootName}/${rootName}`
      const { primary: _p, ...info } = formData[rootNodeId]
      addedFiles[treeData[rootNodeId].fileId] = true

      info.parts = assemblyGroups[rootName]
        .filter(nodeId => nodeId !== rootNodeId)
        .map(nodeId => {
          const { primary: _p, ...partInfo } = formData[nodeId]
          const node = treeData[nodeId]
          const file = uploadedFiles[node.fileId]
          addedFiles[node.fileId] = true

          return {
            ...partInfo,
            originalFileName: file.name,
            filename: file.newFileName,
            size: file.size,
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
        const { primary, ...partInfo } = formData['multipart']

        payload.push({
          ...partInfo,
          parts: remainingFiles.map(file => {
            const nodeId = '/' + file.name

            return {
              ...formData[nodeId],
              originalFileName: file.name,
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
                filename: file.newFileName,
                size: file.size,
                isPrimary: true,
              },
            ],
          })
        })
      }
    }

    try {
      await api({
        method: 'POST',
        endpoint: 'models',
        body: payload,
      })
      store.dispatch(types.FETCH_THANGS, { onFinish })
    } catch (e) {
      store.dispatch(types.SUBMIT_MODELS_FAILED)
    }
  })
}
