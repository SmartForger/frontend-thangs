import api from '@services/api'
import { storageService, intervalRequest } from '@services'
import apiForChain from '@services/api/apiForChain'

const getPhynStatus = intervalRequest(
  ({ newPhyndexerId }) => async (resolve, reject, cancelToken) => {
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/phyn-status/${newPhyndexerId}`,
      cancelToken,
      timeout: 60000,
    })
    if (data === 'error' || error) {
      resolve({ error: error || 'error' })
    }
    if (data === 'completed') resolve(data)
  },
  {
    interval: 5000,
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
    interval: 5000,
    timeout: 10 * 60 * 1000,
  }
)

const noop = () => null
const getInitAtom = () => ({
  thangs: {
    isLoaded: false,
    isLoading: false,
    isError: false,
    data: {},
  },
  phyndexer: {
    isLoaded: false,
    isLoading: false,
    isError: false,
    isPollingError: false,
    data: {},
  },
  text: {
    isLoaded: false,
    isLoading: false,
    isError: false,
    data: {},
  },
})

export default store => {
  store.on('@init', () => ({
    searchResults: getInitAtom(),
  }))
  store.on('loading-search-results-for-text', state => ({
    searchResults: {
      ...state.searchResults,
      text: {
        isLoading: true,
        isLoaded: false,
        isError: false,
        data: {},
      },
    },
  }))
  store.on('loading-search-results-for-thangs', state => ({
    searchResults: {
      ...state.searchResults,
      thangs: {
        isLoading: true,
        isLoaded: false,
        isError: false,
        data: {},
      },
    },
  }))
  store.on('loading-search-results-for-phyndexer', state => ({
    searchResults: {
      ...state.searchResults,
      phyndexer: {
        isLoading: true,
        isLoaded: false,
        isError: false,
        data: {},
      },
    },
  }))
  store.on('loaded-search-results-for-text', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      text: {
        isLoading: false,
        isLoaded: true,
        isError: false,
        data,
      },
    },
  }))
  store.on('loaded-search-results-for-thangs', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      thangs: {
        isLoading: false,
        isLoaded: true,
        isError: false,
        data,
      },
    },
  }))
  store.on('loaded-search-results-for-phyndexer', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      phyndexer: {
        isLoading: false,
        isLoaded: true,
        isError: false,
        data,
      },
    },
  }))
  store.on('error-search-results-for-text', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      text: {
        isLoading: false,
        isLoaded: false,
        isError: true,
        data,
      },
    },
  }))
  store.on('error-search-results-for-thangs', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      thangs: {
        isLoading: false,
        isLoaded: false,
        isError: true,
        data,
      },
    },
  }))
  store.on('error-search-results-for-phyndexer', (state, { data }) => ({
    searchResults: {
      ...state.searchResults,
      phyndexer: {
        isLoading: false,
        isLoaded: false,
        isError: true,
        data,
      },
    },
  }))
  store.on('error-search-results-for-phyndexer-polling', state => ({
    searchResults: {
      ...state.searchResults,
      phyndexer: {
        ...state.searchResults.phyndexer,
        isPollingError: true,
      },
    },
  }))
  store.on('reset-search-results', () => ({
    searchResults: getInitAtom(),
  }))
  store.on(
    'get-search-results-by-text',
    async (state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results-for-text')
      const { data, error } = api({
        method: 'GET',
        endpoint: `models/search-by-text?searchTerm=${searchTerm}`,
      })

      if (error) {
        store.dispatch('error-search-results-for-text', { data: error })
        onError(error)
      } else {
        store.dispatch('loaded-search-results-for-text', {
          data: { matches: data },
        })
        onFinish(error)
      }
    }
  )
  store.on(
    'get-search-results-by-model',
    async (state, { file, data, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results-for-phyndexer')

      let uploadedUrlData

      apiForChain({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })
        .then(({ data }) => {
          uploadedUrlData = data
          return storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)
        })
        .then(() =>
          apiForChain({
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
        )
        .then(({ data: uploadedData }) => {
          const { newPhyndexerId, newModelId } = uploadedData

          store.dispatch('get-related-models-via-phyndexer', {
            newPhyndexerId,
            newModelId,
            onFinish,
          })
        })
        .catch(error => {
          store.dispatch('error-search-results-for-phyndexer', { data: error })
          return onError(error)
        })
    }
  )
  store.on(
    'get-related-models-via-thangs',
    (_state, { modelId, onFinish = noop, onError = noop }) => {
      if (!modelId) return
      store.dispatch('loading-search-results-for-thangs')

      getThangsStatus({ modelId })
        .then(() =>
          apiForChain({
            method: 'GET',
            endpoint: `models/related/${modelId}`,
          })
        )
        .then(({ data }) => {
          store.dispatch('loaded-search-results-for-thangs', { data })
          onFinish(data)
        })
        .catch(error => {
          store.dispatch('error-search-results-for-thangs', { data: error })
          return onError(error)
        })
    }
  )
  store.on(
    'get-related-models-via-phyndexer',
    async (state, { newPhyndexerId, newModelId, onFinish = noop, onError = noop }) => {
      if (!newPhyndexerId) return
      store.dispatch('loading-search-results-for-phyndexer')

      const { error: statusError } = await getPhynStatus({ newPhyndexerId })
      if (statusError) {
        store.dispatch('error-search-results-for-phyndexer-polling', {
          data: statusError,
        })
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/phyn-related/${newPhyndexerId}`,
      })

      if (error) {
        store.dispatch('error-search-results-for-phyndexer', { data: error })
        onFinish({ modelId: newModelId })
        return onError(error)
      } else {
        store.dispatch('loaded-search-results-for-phyndexer', { data })
        onFinish({ modelId: newModelId })
      }
    }
  )
}
