import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelDownloadUrl: getInitAtom(),
  }))

  store.on('loading-model-download-url', state => ({
    modelDownloadUrl: {
      ...state.modelDownloadUrl,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on('loaded-model-download-url', (state, { data }) => ({
    modelDownloadUrl: {
      ...state.modelDownloadUrl,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on('failed-model-download-url', (state, { data }) => ({
    modelDownloadUrl: {
      ...state.modelDownloadUrl,
      isLoading: false,
      isLoaded: true,
      isError: true,
      data,
    },
  }))

  store.on('fetch-model-download-url', async (_, { modelId, onFinish }) => {
    store.dispatch('loading-model-download-url')
    const {data, error} = await api({method: 'GET', endpoint: `models/${modelId}/download-url`})
    if (error) {
      store.dispatch('failed-model-download-url')
    } else {
      store.dispatch('loaded-model-download-url', {data})
      onFinish(data && data.signedUrl)
    }
  })
}
