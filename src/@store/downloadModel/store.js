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
      ...state.models,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on('loaded-model-download-url', (state, { data }) => ({
    modelDownloadUrl: {
      ...state.models,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on('fetch-model-download-url', async (_, { modelId, onFinish, onError }) => {
    store.dispatch('loading-model-download-url')
    const {data, error} = await api({method: 'GET', endpoint: `models/${modelId}/download-url`})
    if (error) {
      return onError(error)
    } else {
      store.dispatch('loaded-model-download-url', {data})
      onFinish()
    }
  })
}
