import * as types from '@constants/storeEventTypes'
import { api, uploadFiles, cancelUpload } from '@services'
import { track } from '@utilities/analytics'
import { sleep, findNodeByName } from '@utilities'
import * as R from 'ramda'
import { mockUploadedFiles, mockValidationTree } from 'mocks/assembly-upload'

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

  store.on(types.UPLOADING_FILES, state => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        isLoading: true,
      },
    }
  })

  store.on(types.UPLOADED_FILES, state => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        isLoading: false,
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

  store.on(types.VALIDATE_FILES_SUCCESS, (state, { validationTree, uploadedFiles }) => {
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
      console.log(e)
      store.dispatch(types.VALIDATE_FILES_FAILED)
    }
  })

  store.on(types.UPLOAD_FILES, async (_, { files }) => {
    store.dispatch(types.INIT_UPLOAD_FILES, { files })
    uploadFiles(files)
  })

  store.on(types.SUBMIT_FILES, async (state, { onFinish = noop }) => {
    store.dispatch(types.UPLOADING_FILES)
    const uploadedFiles = R.path(['uploadFiles', 'data'], state) || []
    const filteredFiles = {}
    Object.keys(uploadedFiles).forEach(fileDataId => {
      if (uploadedFiles[fileDataId].name)
        filteredFiles[fileDataId] = uploadedFiles[fileDataId]
    })
    submitFile({ files: Object.values(filteredFiles) }).then(() => {
      track('New Models Uploaded', { amount: uploadedFiles.length })
      store.dispatch(types.UPLOADED_FILES)
      store.dispatch(types.FETCH_THANGS, { onFinish })
    })
  })

  const submitFile = async ({ files }) => {
    try {
      const response = await api({
        method: 'POST',
        endpoint: 'models',
        body: files.map(file => ({
          ...file,
          filename: file.newFileName,
          originalFileName: file.fileName,
          units: 'mm',
          searchUpload: false,
          isPrivate: false,
        })),
      })
      files.forEach((file, i) => {
        if (!response[i]) {
          store.dispatch(types.CHANGE_UPLOAD_FILE, {
            id: file.id,
            data: '',
            isError: true,
          })
        }
        track('New Model Uploaded')
      })
    } catch (e) {
      files.forEach(file => {
        store.dispatch(types.CHANGE_UPLOAD_FILE, {
          id: file.id,
          data: e,
          isError: true,
        })
      })
      return
    }
  }
}
