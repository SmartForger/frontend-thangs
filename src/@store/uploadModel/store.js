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
  store.on('reset-upload-model', () => ({
    uploadModel: getInitAtom(),
  }))
  store.on('loading-upload-model', ({ uploadModel }) => ({
    uploadModel: {
      ...uploadModel,
      isLoading: true,
      isLoaded: false,
      isError: false,
    },
  }))
  store.on('loaded-upload-model', ({ uploadModel }, { data }) => ({
    uploadModel: {
      ...uploadModel,
      data,
      isLoading: false,
      isLoaded: true,
    },
  }))
  store.on('failure-upload-model', ({ uploadModel }) => ({
    uploadModel: {
      ...uploadModel,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))
  store.on('upload-model', async (state, { file, data, onFinish = noop }) => {
    store.dispatch('loading-upload-model')

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
        store.dispatch('failure-upload-model')
      } else {
        store.dispatch('loaded-upload-model', { data: uploadedData })
        onFinish()
        pendo.track('Model Uploaded')
      }
    } catch (e) {
      store.dispatch('failure-upload-model')
    }
  })
}
