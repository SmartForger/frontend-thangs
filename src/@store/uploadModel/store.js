import api from '@services/api'
import { storageService } from '@services'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const noop = () => null
const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadModel: getInitAtom(),
  }))
  store.on(types.RESET_UPLOAD_MODEL, () => ({
    uploadModel: getInitAtom(),
  }))
  store.on(types.LOADING_UPLOAD_MODEL, ({ uploadModel }) => ({
    uploadModel: {
      ...uploadModel,
      isLoading: true,
      isLoaded: false,
      isError: false,
    },
  }))
  store.on(types.LOADED_UPLOAD_MODEL, ({ uploadModel }, { data }) => ({
    uploadModel: {
      ...uploadModel,
      data,
      isLoading: false,
      isLoaded: true,
    },
  }))
  store.on(types.FAILURE_UPLOAD_MODEL, ({ uploadModel }) => ({
    uploadModel: {
      ...uploadModel,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))
  store.on(types.UPLOAD_MODEL, async (state, { file, data, onFinish = noop }) => {
    store.dispatch(types.LOADING_UPLOAD_MODEL)

    try {
      const { data: uploadedUrlData } = await api({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })

      await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)

      const { data: uploadedData, error } = await api({
        method: 'POST',
        endpoint: 'models',
        body: {
          filename: uploadedUrlData.newFileName || '',
          originalFileName: file.name,
          units: 'mm',
          searchUpload: false,
          isPrivate: false,
          ...data,
        },
      })

      if (error) {
        store.dispatch(types.FAILURE_UPLOAD_MODEL)
      } else {
        store.dispatch(types.LOADED_UPLOAD_MODEL, { data: uploadedData })
        onFinish()
        pendo.track('Model Uploaded')
      }
    } catch (e) {
      store.dispatch(types.FAILURE_UPLOAD_MODEL)
    }
  })
}
