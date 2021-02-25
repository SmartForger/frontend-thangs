import * as types from '@constants/storeEventTypes'
import api from '@services/api'
import { storageService } from '@services'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    license: getInitAtom(),
  }))

  store.on(types.LOADING_MODEL_LICENSE, state => ({
    license: {
      ...state.license,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_MODEL_LICENSE, (state, { data }) => ({
    license: {
      ...state.license,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_MODEL_LICENSE, state => ({
    license: {
      ...state.license,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))

  store.on(types.FETCH_MODEL_LICENSE, async (state, { modelId, _onFinish }) => {
    store.dispatch(types.LOADING_MODEL_LICENSE)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${modelId}/license`,
    })

    if (error) {
      store.dispatch(types.FAILED_MODEL_LICENSE)
    } else {
      store.dispatch(types.LOADED_MODEL_LICENSE, {
        data,
      })
    }
  })

  store.on(
    types.UPLOAD_MODEL_LICENSE,
    async (state, { file, directory, modelId, onFinish = noop, onError = noop }) => {
      let uploadedUrlData
      const { data, error } = await api({
        method: 'POST',
        endpoint: `models/${directory || modelId}/upload-collateral-file-urls`,
        body: {
          fileNames: [file],
        },
      })
      if (error) {
        store.dispatch(types.FAILED_MODEL_LICENSE)
        return onError(error)
      }
      uploadedUrlData = data[0]
      await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)
      store.dispatch(types.LOADED_MODEL_LICENSE, {
        uploadedUrlData,
      })
      return onFinish(uploadedUrlData.newFileName)
    }
  )
}
