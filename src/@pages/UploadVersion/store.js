import api from '@services/api'
import { uploadToSignedUrl } from '@services/storageService'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on('@init', () => ({
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
  store.on('upload-model', async (state, { file, data }) => {
    store.dispatch('loading-upload-model')

    try {
      const { data: uploadedUrlData } = await api({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })

      await uploadToSignedUrl(uploadedUrlData.signedUrl, file)

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
      }
    } catch (e) {
      store.dispatch('failure-upload-model')
    }
  })
}
