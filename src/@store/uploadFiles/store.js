import * as types from '@constants/storeEventTypes'
import { api, uploadFile, cancelUpload } from '@services'
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

  store.on(
    types.INIT_UPLOAD_FILE,
    (state, { id, file, isLoading, isError, isWarning }) => {
      return {
        uploadFiles: {
          ...state.uploadFiles,
          data: {
            ...state.uploadFiles.data,
            [id]: { name: file.name, size: file.size, isLoading, isError, isWarning },
          },
        },
      }
    }
  )

  store.on(types.CHANGE_UPLOAD_FILE, (state, { id, data, isLoading, isError }) => {
    const { validating, data: uploadedFiles } = state.uploadFiles
    const newUploadedFiles = {
      ...uploadedFiles,
      [id]: { ...uploadedFiles[id], ...data, isLoading, isError },
    }
    const currentFileUploaded = uploadedFiles[id].isLoading !== isLoading
    const uploadComplete = Object.values(newUploadedFiles).every(f => !f.isLoading)
    if (currentFileUploaded && uploadComplete && !validating) {
      store.dispatch(types.VALIDATE_FILES)
    }

    return {
      uploadFiles: {
        ...state.uploadFiles,
        data: newUploadedFiles,
        validating: currentFileUploaded && uploadComplete && !validating,
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
        data: uploadedFiles, // TO be removed later
        validating: false,
        validated: true,
        isAssembly: true,
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

  // TODO: Update with actual API request
  store.on(types.VALIDATE_FILES, async state => {
    // Get API Data
    await sleep(1000)
    store.dispatch(types.VALIDATE_FILES_SUCCESS, {
      validationTree: mockValidationTree,
      uploadedFiles: mockUploadedFiles,
    })
  })

  store.on(types.UPLOAD_FILE, async (_, { id, file, errorState = undefined }) => {
    store.dispatch(types.INIT_UPLOAD_FILE, {
      id,
      file,
      error: errorState && errorState.message,
      isLoading: errorState && errorState.error ? false : true,
      isError: errorState && errorState.error,
      isWarning: errorState && errorState.warning,
    })
    if (!errorState || !errorState.error) {
      uploadFile(id, file)
    }
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
