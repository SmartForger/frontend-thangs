import api from '@services/api'
import { storageService } from '@services'

const poll = async ({ fn, validate, fail, interval, maxAttempts }) => {
  let attempts = 0

  const executePoll = async (resolve, reject) => {
    const result = await fn()
    attempts++

    if (validate(result)) {
      return resolve(result)
    } else if (fail(result)) {
      return reject(new Error('Polling failed'))
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'))
    } else {
      setTimeout(executePoll, interval, resolve, reject)
    }
  }

  return new Promise(executePoll)
}

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
    async (state, { file, data, onUploaded = noop, onFinish = noop, onError = noop }) => {
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
      onUploaded(uploadedUrlData)
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
      /* Before
      const newMatches = uploadedData.matches
        ? uploadedData.matches.map(match => {
          return {
            ...match,
            searchModel: uploadedData.searchByModelFileName,
            resultSource: 'phyndexer',
          }
        })
        : []
      
      const newResult = {
        matches: newMatches,
        modelId: uploadedData.newModelId,
        searchModel:
          uploadedData.searchByModelFileName &&
          uploadedData.searchByModelFileName.replace('uploads/models/', ''),
      }
      store.dispatch('loaded-search-results', { data: newResult })
      onFinish(newResult)
      Before */

      const newResult = {
        matches: uploadedData.matches,
        modelId: uploadedData.newModelId,
        phyndexerId: uploadedData.newPhyndexerId,
        searchModel:
          uploadedData.searchByModelFileName &&
          uploadedData.searchByModelFileName.replace('uploads/models/', ''),
      }
      store.dispatch('get-related-models', { data: newResult })
      onFinish(newResult)
    }
  )
  store.on(
    'get-related-models',
    async (state, { modelId, onFinish = noop, onError = noop }) => {
      if (!modelId) return
      store.dispatch('polling-related-models')
      const getStatus = async () => {
        return await api({
          method: 'GET',
          endpoint: `models/status/${modelId}`,
        })
      }

      const { error: statusError } = await poll({
        fn: getStatus,
        validate: ({ data }) => data === 'completed',
        fail: ({ data }) => data === 'error',
        interval: 1000,
        maxAttempts: 1000,
      })
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
}
