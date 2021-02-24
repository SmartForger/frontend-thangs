import * as types from '@constants/storeEventTypes'
import api from '@services/api'
import { storageService } from '@services'
import apiForChain from '@services/api/apiForChain'

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
    async (state, { file, directory, onFinish = noop, onError = noop }) => {
      let uploadedUrlData

      apiForChain({
        method: 'POST',
        endpoint: 'models/upload-urls',
        body: {
          fileNames: [file],
          directory,
        },
      })
        .then(({ data = {} }) => {
          uploadedUrlData = data
          return storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)
        })
        .then(() => {
          store.dispatch(types.LOADED_MODEL_LICENSE, {
            uploadedUrlData,
          })
          console.log('in the then', onFinish)
          return onFinish(uploadedUrlData.newFileName)
        })
        .catch(error => {
          store.dispatch(types.FAILED_MODEL_LICENSE)
          return onError(error)
        })
    }
  )
}
