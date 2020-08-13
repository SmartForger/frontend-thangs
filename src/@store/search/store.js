import api from '@services/api'
import { storageService } from '@services'

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
      ...state.results,
      data,
    },
  }))
  store.on('loading-search-results', state => ({
    searchResults: {
      ...state.results,
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on('loaded-search-results', (state, { data }) => ({
    searchResults: {
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on('error-search-results', (state, { data }) => ({
    searchResults: {
      isLoading: false,
      isLoaded: false,
      isError: true,
      data,
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
      if (uploadError)
        return store.dispatch('error-search-results', { data: uploadError })
      const { error: signUrlError } = await storageService.uploadToSignedUrl(
        uploadedUrlData.signedUrl,
        file
      )
      if (signUrlError)
        return store.dispatch('error-search-results', { data: signUrlError })
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

      const newMatches = uploadedData.matches.map(match => {
        return {
          ...match,
          searchModel: uploadedData.searchByModelFileName,
          resultSource: 'phyndexer',
        }
      })
      debugger
      const newResult = {
        matches: newMatches,
        modelId: uploadedData.newModelId,
        searchModel:
          uploadedData.searchByModelFileName &&
          uploadedData.searchByModelFileName.replace('uploads/models/', ''),
      }

      if (error) {
        store.dispatch('error-search-results', { data: error })
      } else {
        store.dispatch('loaded-search-results', { data: newResult })
        onFinish(newResult)
      }
    }
  )
}
