import * as types from '@constants/storeEventTypes'
import { api, uploadFiles, cancelUpload } from '@services'
import { findNodeByName, flattenTree } from '@utilities'
import * as R from 'ramda'

const getInitAtom = () => ({
  isLoading: false,
  isError: false,
  data: {},
  validationTree: null,
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
    const newUploadedFiles = { ...state.uploadFiles.data }
    delete newUploadedFiles[index]
    return {
      uploadFiles: {
        ...state.uploadFiles,
        data: newUploadedFiles,
      },
    }
  })

  store.on(types.CANCEL_UPLOAD, (state, { filename }) => {
    const cancelNode = node => {
      const fileIndex = Object.values(state.uploadFiles.data).findIndex(
        f => f.name === node.name
      )
      if (fileIndex >= 0) {
        cancelUpload(Object.keys(state.uploadFiles.data)[fileIndex])
      }

      if (node.subs) {
        node.subs.forEach(subnode => cancelNode(subnode))
      }
    }

    const node = state.uploadFiles.validationTree.find(node => node.name === filename)
    if (node) {
      cancelNode(node)
    } else {
      cancelNode({ name: filename })
    }

    return {
      uploadFiles: {
        ...state.uploadFiles,
        validationTree: state.uploadFiles.validationTree.filter(
          node => node.name !== filename
        ),
      },
    }
  })

  store.on(types.INIT_UPLOAD_FILES, (state, { files }) => {
    const newFilesMap = files.reduce(
      (newFiles, f) => ({
        ...newFiles,
        [f.id]: {
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

  store.on(types.SET_ASSEMBLY_FORMDATA, (state, { formData }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        assemblyData: formData,
      },
    }
  })

  store.on(types.SKIP_MISSING_FILE, (state, { filename }) => {
    const { validationTree, data } = state.uploadFiles

    if (validationTree && validationTree.length > 0) {
      const node = findNodeByName(validationTree, filename)
      if (node) {
        node.skipped = true
      }

      return {
        uploadFiles: {
          ...state.uploadFiles,
          validationTree: JSON.parse(JSON.stringify(validationTree)),
        },
      }
    }

    const node = findNodeByName(Object.values(data), filename)
    if (node) {
      node.skipped = true
    }

    return {
      uploadFiles: {
        ...state.uploadFiles,
        data: JSON.parse(JSON.stringify(data)),
      },
    }
  })

  store.on(types.VALIDATE_FILES_SUCCESS, (state, { validationTree }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        validationTree,
        validating: false,
        validated: true,
        isAssembly: validationTree && validationTree.length > 0,
      },
    }
  })

  store.on(types.VALIDATE_FILES_FAILED, state => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        validationTree: [],
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

  // TODO: Update with actual API request
  store.on(types.VALIDATE_FILES, async state => {
    const { data } = state.uploadFiles
    const isLoading = Object.values(data).some(file => file.isLoading)
    if (isLoading) {
      return
    }

    store.dispatch(types.SET_VALIDATING, { validating: true })

    // Get API Data
    try {
      const { data: responseData } = await api({
        method: 'POST',
        endpoint: 'models/validatefiles',
        body: {
          fileNames: Object.values(data).map(file => file.newFileName),
        },
      })

      let validationTree = []
      const uploadedFiles = Object.values(data)

      if (responseData.isAssembly !== false) {
        const transformNode = (node1, node2) => {
          const newNode = {
            name: node1.name,
            isAssembly: node1.isAssembly,
            valid: node2.valid,
          }

          if (node1.subs && node1.subs.length > 0) {
            newNode.subs = R.uniqBy(
              R.prop('name'),
              node1.subs.map((subnode, i) => transformNode(subnode, node2.subs[i]))
            )
          }

          return newNode
        }

        validationTree = responseData.map(model => {
          const tree = transformNode(model.modelDescription, model.validation)

          const rootFile = R.find(R.propEq('newFileName', tree.name))(uploadedFiles)
          if (rootFile) {
            tree.name = rootFile.name
          }

          return tree
        })
      }

      store.dispatch(types.VALIDATE_FILES_SUCCESS, {
        validationTree,
      })
    } catch (e) {
      store.dispatch(types.VALIDATE_FILES_FAILED)
    }
  })

  store.on(types.UPLOAD_FILES, async (state, { files }) => {
    store.dispatch(types.INIT_UPLOAD_FILES, { files })

    const { validationTree, data } = state.uploadFiles
    const uploadedFiles = Object.values(data)
    const filesWithDirectory = files.map(fileObj => {
      if (validationTree) {
        const tree = validationTree.find(t => !!findNodeByName([t], fileObj.file.name))
        if (tree) {
          const rootFile = uploadedFiles.find(f => f.name === tree.name)
          if (rootFile && rootFile.newFileName) {
            const arr = rootFile.newFileName.split('/')
            return { ...fileObj, directory: arr[0] }
          }
        }
      }

      return fileObj
    })

    uploadFiles(filesWithDirectory)
  })

  store.on(types.SUBMIT_MODELS, async (state, { onFinish = noop }) => {
    store.dispatch(types.SUBMITTING_MODELS)

    const {
      data: uploadedFiles,
      validationTree,
      assemblyData,
      isAssembly,
    } = state.uploadFiles

    const payload = []

    const filteredFiles = {}
    Object.keys(uploadedFiles).forEach(fileDataId => {
      if (uploadedFiles[fileDataId].name)
        filteredFiles[fileDataId] = uploadedFiles[fileDataId]
    })
    const filesArray = Object.values(filteredFiles)
    const addedFiles = {}

    if (validationTree) {
      validationTree.forEach(tree => {
        const nodes = flattenTree([tree])
        payload.push(createModelObject(nodes, filesArray, assemblyData))
        nodes.forEach(node => (addedFiles[node.name] = true))
      })
    }

    const remainingFiles = filesArray.filter(f => !addedFiles[f.name])
    if (isAssembly) {
      if (remainingFiles.length > 0) {
        payload.push(createModelObject(remainingFiles, remainingFiles, assemblyData))
      }
    } else {
      remainingFiles.forEach(file => {
        payload.push(createModelObject([file], remainingFiles))
      })
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

const createModelObject = (treeNodes, filesArray, assemblyData) => {
  let result

  if (assemblyData) {
    result = {
      name: assemblyData.name,
      description: assemblyData.description,
      category: assemblyData.category,
      folderId: assemblyData.folderId,
      parts: [],
    }
  } else {
    result = {
      name: treeNodes[0].name,
      description: treeNodes[0].description,
      category: treeNodes[0].category,
      folderId: treeNodes[0].folderId,
      parts: [],
    }
  }

  treeNodes.forEach(node => {
    const fileObj = filesArray.find(f => f.name === node.name)
    if (fileObj) {
      result.parts.push({
        name: fileObj.name,
        originalFileName: fileObj.name,
        filename: fileObj.newFileName,
        size: fileObj.size,
        material: fileObj.material,
        height: fileObj.height,
        weight: fileObj.weight,
        isPrimary: !assemblyData || assemblyData.primary === fileObj.name,
      })
    }
  })

  return result
}
