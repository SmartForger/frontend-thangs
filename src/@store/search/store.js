import api from '@services/api'
import { storageService, intervalRequest } from '@services'

const getPhynStatus = intervalRequest(
  ({ newPhyndexerId }) => async (resolve, reject, cancelToken) => {
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/phyn-status/${newPhyndexerId}`,
      cancelToken,
      timeout: 60000,
    })
    if (data === 'error' || error) {
      reject(data || error)
    }
    if (data === 'completed') resolve(data)
  },
  {
    interval: 1000,
    timeout: 10 * 60 * 1000,
  }
)

const getThangsStatus = intervalRequest(
  ({ modelId }) => async (resolve, reject, cancelToken) => {
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/status/${modelId}`,
      cancelToken,
      timeout: 60000,
    })
    if (data === 'error' || error) {
      reject(data || error)
    }
    if (data === 'completed') resolve(data)
  },
  {
    interval: 1000,
    timeout: 10 * 60 * 1000,
  }
)

const noop = () => null
const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on('@init', () => ({
    searchResults: getInitAtom(),
  }))

  store.on('update-search-results', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      data,
    },
  }))
  store.on('loading-search-results', state => ({
    searchResults: {
      ...state.searchResults,
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on('loaded-search-results', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on('polling-related-models', state => ({
    searchResults: {
      ...state.searchResults,
      isPolling: true,
    },
  }))
  store.on('loaded-related-results', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      isPolling: false,
      isPollingError: false,
      matchingResults: data,
    },
  }))
  store.on('error-search-results', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      isLoading: false,
      isLoaded: false,
      isError: true,
      data,
    },
  }))
  store.on('error-polling-results', state => ({
    searchResults: {
      ...state.searchResults,
      isPolling: false,
      isPollingError: true,
    },
  }))
  store.on('reset-search-results', () => ({
    searchResults: getInitAtom(),
  }))
  store.on(
    'get-search-results-by-text',
    async (state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results')
      api({
        method: 'GET',
        endpoint: `models/search-by-text?searchTerm=${searchTerm}`,
      })
        .then(res => {
          if (res.status === 200) {
            store.dispatch('loaded-search-results', { data: { matches: res.data } })
            onFinish(res)
          }
        })
        .catch(error => {
          store.dispatch('error-search-results', { data: error })
          onError(error)
        })
    }
  )
  store.on(
    'get-search-results-by-model',
    async (state, { file, data, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results')

      const { data: uploadedUrlData, error: uploadError } = await api({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })
      if (uploadError) {
        store.dispatch('error-search-results', { data: uploadError })
        return onError(uploadError)
      }
      const { error: signUrlError } = await storageService.uploadToSignedUrl(
        uploadedUrlData.signedUrl,
        file
      )
      if (signUrlError) {
        store.dispatch('error-search-results', { data: signUrlError })
        return onError(signUrlError)
      }

      const { data: uploadedData, error } = await api({
        method: 'POST',
        endpoint: 'models/search-by-model',
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
        store.dispatch('error-search-results', { data: error })
        return onError(error)
      }

      const { newPhyndexerId, newModelId } = uploadedData

      store.dispatch('get-related-models-via-physndexer', {
        newPhyndexerId,
        newModelId,
        onFinish,
      })
    }
  )
  store.on(
    'get-related-models-via-thangs',
    async (state, { modelId, onFinish = noop, onError = noop }) => {
      if (!modelId) return
      store.dispatch('polling-related-models')

      const { error: statusError } = await getThangsStatus({ modelId })

      if (statusError) {
        store.dispatch('error-polling-results', { data: statusError })
        return onError(statusError)
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/related/${modelId}`,
      })

      if (error) {
        store.dispatch('error-polling-results', { data: error })
        return onError(error)
      } else {
        store.dispatch('loaded-related-results', { data })
        onFinish(data)
      }
    }
  )
  store.on(
    'get-related-models-via-physndexer',
    async (state, { newPhyndexerId, newModelId, onFinish = noop, onError = noop }) => {
      if (!newPhyndexerId) return
      store.dispatch('polling-related-models')

      const { error: statusError } = await getPhynStatus({ newPhyndexerId })

      if (statusError) {
        store.dispatch('error-polling-results', { data: statusError })
        return onError(statusError)
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/phyn-related/${newPhyndexerId}`,
      })

      if (error) {
        store.dispatch('error-polling-results', { data: error })
        return onError(error)
      } else {
        store.dispatch('loaded-search-results', { data })
        onFinish({ modelId: newModelId })
      }
    }
  )
}
