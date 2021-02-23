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
    licenseDownloadUrl: getInitAtom(),
  }))

  store.on(types.LOADING_LICENSE_DOWNLOAD_URL, state => ({
    licenseDownloadUrl: {
      ...state.licenseDownloadUrl,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_LICENSE_DOWNLOAD_URL, (state, { data }) => ({
    licenseDownloadUrl: {
      ...state.licenseDownloadUrl,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_LICENSE_DOWNLOAD_URL, state => ({
    licenseDownloadUrl: {
      ...state.licenseDownloadUrl,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))

  store.on(types.FETCH_LICENSE_DOWNLOAD_URL, async (_, { id, onFinish }) => {
    store.dispatch(types.LOADING_LICENSE_DOWNLOAD_URL)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${id}/download-license-url`,
    })
    if (error) {
      store.dispatch(types.FAILED_LICENSE_DOWNLOAD_URL)
    } else {
      store.dispatch(types.LOADED_LICENSE_DOWNLOAD_URL, { data })
      onFinish(data && data.signedUrl)
    }
  })
}
