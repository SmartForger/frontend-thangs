import * as types from '@constants/storeEventTypes'
import { api, storageService } from '@services'

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadFiles: {},
  }))

  store.on(types.RESET_UPLOAD_FILES, () => ({
    uploadFiles: {},
  }))

  store.on(types.REMOVE_UPLOAD_FILES, (state, { index }) => {
    const newUploadedFiles = { ...state.uploadFiles }
    delete newUploadedFiles[index]
    return {
      uploadFiles: newUploadedFiles,
    }
  })

  store.on(types.INIT_UPLOAD_FILE, (state, { id, file, isLoading, isError }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        [id]: { name: file.name, size: file.size, isLoading, isError },
      },
    }
  })

  store.on(types.CHANGE_UPLOAD_FILE, (state, { id, data, isLoading, isError }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        [id]: { ...state.uploadFiles[id], ...data, isLoading, isError },
      },
    }
  })

  store.on(types.UPLOAD_FILE, async (_, { id, file }) => {
    store.dispatch(types.INIT_UPLOAD_FILE, {
      id,
      file,
      isLoading: true,
      isError: false,
    })

    try {
      const { data: uploadedUrlData } = await api({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })

      await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)

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
  })

  store.on(types.SUBMIT_FILES, async (state, { onFinish = noop }) => {
    Promise.all(
      Object.keys(state.uploadFiles).map(fileId => {
        const file = state.uploadFiles[fileId]
        store.dispatch(types.SUBMIT_FILE, { file })
      })
    ).then(() => {
      store.dispatch(types.FETCH_FOLDERS)
      store.dispatch(types.FETCH_THANGS, { onFinish })
    })
  })

  store.on(types.SUBMIT_FILE, async (_, { file }) => {
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
      }
    } catch (e) {
      store.dispatch(types.CHANGE_UPLOAD_FILE, { id: file.id, data: e, isError: true })
    }
  })
}
