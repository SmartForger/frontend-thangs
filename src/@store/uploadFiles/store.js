import * as types from '@constants/storeEventTypes'
import { api, storageService } from '@services'

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

  store.on(types.INIT_UPLOAD_FILE, (state, { id, file, isLoading, isError }) => {
    return {
      uploadFiles: {
        ...state.uploadFiles,
        data: {
          ...state.uploadFiles.data,
          [id]: { name: file.name, size: file.size, isLoading, isError },
        },
      },
    }
  })

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
    store.dispatch(types.UPLOADING_FILES)
    Promise.all(
      Object.keys(state.uploadFiles.data).map(fileId => {
        const file = state.uploadFiles.data[fileId]
        return submitFile({ file })
      })
    ).then(() => {
      store.dispatch(types.UPLOADED_FILES)
      store.dispatch(types.FETCH_FOLDERS)
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
