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

  store.on(types.LOADING_MODEL_DOWNLOAD_URL, state => ({
    modelDownloadUrl: {
      ...state.modelDownloadUrl,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_MODEL_DOWNLOAD_URL, (state, { data }) => ({
    modelDownloadUrl: {
      ...state.modelDownloadUrl,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_MODEL_DOWNLOAD_URL, state => ({
    modelDownloadUrl: {
      ...state.modelDownloadUrl,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))

  store.on(types.FETCH_MODEL_DOWNLOAD_URL, async (_, { id, format, onFinish }) => {
    store.dispatch(types.LOADING_MODEL_DOWNLOAD_URL)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${id}/download-url?targetFormat=${format}#cacheBuster=${Date.now()}`,
    })

    if (error || data?.fileName === 'Error') {
      store.dispatch(types.FAILED_MODEL_DOWNLOAD_URL)
    } else {
      store.dispatch(types.LOADED_MODEL_DOWNLOAD_URL, { data })
      onFinish(data && data.signedUrl)
    }
  })
}
