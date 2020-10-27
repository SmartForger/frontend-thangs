import * as types from '@constants/storeEventTypes'
import { api, storageService } from '@services'
import { track } from '@utilities/analytics'
import * as R from 'ramda'

const getInitAtom = () => ({
  isLoading: false,
  isError: false,
  data: {},
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
        isLoading: true,
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

  store.on(types.UPLOAD_FILE, async (_, { id, file, errorState = undefined, cancelToken }) => {
    store.dispatch(types.INIT_UPLOAD_FILE, {
      id,
      file,
      error: errorState && errorState.message,
      isLoading: errorState && errorState.error ? false : true,
      isError: errorState && errorState.error,
      isWarning: errorState && errorState.warning,
    })
    if (!errorState || !errorState.error) {
      try {
        const { data: uploadedUrlData } = await api({
          method: 'GET',
          endpoint: `models/upload-url?fileName=${file.name}`,
          cancelToken,
        })

        await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file, { cancelToken })

        store.dispatch(types.CHANGE_UPLOAD_FILE, {
          id,
          data: uploadedUrlData,
          isLoading: false,
          isError: false,
        })
      } catch (e) {
        store.dispatch(types.CHANGE_UPLOAD_FILE, {
          id,
          data: e,
          isLoading: false,
          isError: true,
        })
      }
    }
  })

  store.on(types.SUBMIT_FILES, async (state, { onFinish = noop }) => {
    store.dispatch(types.UPLOADING_FILES)
    const uploadedFiles = R.path(['uploadFiles', 'data'], state) || []
    Promise.all(
      Object.keys(uploadedFiles).map(fileId => {
        const file = uploadedFiles[fileId]
        return submitFile({ file })
      })
    ).then(() => {
      track('New Models Uploaded', { amount: uploadedFiles.length })
      store.dispatch(types.UPLOADED_FILES)
      store.dispatch(types.FETCH_THANGS, { onFinish })
    })
  })

  const submitFile = async ({ file }) => {
    try {
      const {
        newFileName,
        fileName,
        isError: _e,
        isLoading: _l,
        signedUrl: _u,
        ...otherData
      } = file
      const { error } = await api({
        method: 'POST',
        endpoint: 'models',
        body: {
          filename: newFileName,
          originalFileName: fileName,
          units: 'mm',
          searchUpload: false,
          isPrivate: false,
          ...otherData,
        },
      })

      if (error) {
        store.dispatch(types.CHANGE_UPLOAD_FILE, {
          id: file.id,
          data: error,
          isError: true,
        })
        return
      }
      return
    } catch (e) {
      store.dispatch(types.CHANGE_UPLOAD_FILE, { id: file.id, data: e, isError: true })
      return
    }
  }
}
