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
    interval: 3000,
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
  store.on('reset-search-results', () => ({
    searchResults: getInitAtom(),
  }))
  store.on(
    'get-search-results-by-text',
    async (state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results-for-text')
      api({
        method: 'GET',
        endpoint: `models/search-by-text?searchTerm=${searchTerm}`,
      })
        .then(res => {
          if (res.status === 200) {
            store.dispatch('loaded-search-results-for-text', {
              data: { matches: res.data },
            })
            onFinish(res)
          }
        })
        .catch(error => {
          store.dispatch('error-search-results-for-text', { data: error })
          onError(error)
        })
    }
  )
  store.on(
    'get-search-results-by-model',
    async (state, { file, data, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results-for-phyndexer')

      const { data: uploadedUrlData, error: uploadError } = await api({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })
      if (uploadError) {
        store.dispatch('error-search-results-for-phyndexer', { data: uploadError })
        return onError(uploadError)
      }
      const { error: signUrlError } = await storageService.uploadToSignedUrl(
        uploadedUrlData.signedUrl,
        file
      )
      if (signUrlError) {
        store.dispatch('error-search-results-for-phyndexer', { data: signUrlError })
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
        store.dispatch('error-search-results-for-phyndexer', { data: error })
        return onError(error)
      }

      const { newPhyndexerId, newModelId } = uploadedData

      store.dispatch('get-related-models-via-phyndexer', {
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
      store.dispatch('loading-search-results-for-thangs')

      const { error: statusError } = await getThangsStatus({ modelId })

      if (statusError) {
        store.dispatch('error-search-results-for-thangs', { data: statusError })
        return onError(statusError)
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/related/${modelId}`,
      })

      if (error) {
        store.dispatch('error-search-results-for-thangs', { data: error })
        return onError(error)
      } else {
        store.dispatch('loaded-search-results-for-thangs', { data })
        onFinish(data)
      }
    }
  )
  store.on(
    'get-related-models-via-phyndexer',
    async (state, { newPhyndexerId, newModelId, onFinish = noop, onError = noop }) => {
      if (!newPhyndexerId) return
      store.dispatch('loading-search-results-for-phyndexer')

      const { error: statusError } = await getPhynStatus({ newPhyndexerId })

      if (statusError) {
        store.dispatch('error-search-results-for-phyndexer', { data: statusError })
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
