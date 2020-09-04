import api from '@services/api'
import { storageService, intervalRequest } from '@services'
import apiForChain from '@services/api/apiForChain'
import { getStatusState, STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const ATOMS = {
  THANGS: 'thangs',
  PHYNDEXER: 'phyndexer',
}

const pollMatches = intervalRequest(
  ({ modelId, store, onSomeResult }) => async (resolve, reject, cancelToken) => {
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/match/${modelId}`,
      cancelToken,
      timeout: 60000,
    })
    if (data === 'error' || error) {
      reject(data || error)
    }
    let allResolved = true
    let matchCount = 0
    if (data && Array.isArray(data)) {
      data.forEach(result => {
        const { collection, status, ...searchData } = result
        if (status === 'completed') {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: collection,
            status: STATUSES.LOADED,
            data: { ...searchData },
          })
          matchCount += searchData && searchData.matches && searchData.matches.length
        } else if (status === 'error') {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: collection,
            status: STATUSES.FAILURE,
            data: { ...searchData },
          })
        } else {
          allResolved = false
        }
      })
    }
    if (matchCount > 0 || allResolved) onSomeResult({ modelId })
    if (allResolved) resolve({ data: { ...data, matchCount } })
  },
  {
    interval: 5000,
    timeout: 10 * 60 * 1000,
  }
)

const noop = () => null
const getInitAtom = () => ({
  [ATOMS.THANGS]: {
    ...getStatusState(STATUSES.INIT),
    data: {},
  },
  [ATOMS.PHYNDEXER]: {
    ...getStatusState(STATUSES.INIT),
    isPollingError: false,
    data: {},
  },
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    searchResults: getInitAtom(),
  }))

  store.on(types.CHANGE_SEARCH_RESULTS_STATUS, (state, { atom, status, data }) => ({
    searchResults: {
      ...state.searchResults,
      [atom]: {
        ...getStatusState(status),
        data,
      },
    },
  }))

  store.on(types.ERROR_POLLING_PHYNDEXER, state => ({
    searchResults: {
      ...state.searchResults,
      phyndexer: {
        ...state.searchResults.phyndexer,
        isPollingError: true,
      },
    },
  }))
  store.on(types.RESET_SEARCH_RESULTS, () => ({
    searchResults: getInitAtom(),
  }))
  store.on(
    types.GET_TEXT_SEARCH_RESULTS,
    async (_state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/search-by-text?searchTerm=${searchTerm}`,
      })
      pendo.track('Text Search Started', {
        searchTerm,
      })

      if (error) {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.THANGS,
          status: STATUSES.FAILURE,
          data: error,
        })
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.FAILURE,
          data: error,
        })
        onError(error)
      } else {
        let numOfMatches = 0
        if (data && Array.isArray(data)) {
          data.forEach(result => {
            const { collection, ...searchData } = result
            numOfMatches += searchData && searchData.matches && searchData.matches.length
            store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
              atom: collection,
              status: STATUSES.LOADED,
              data: { ...searchData },
            })
          })
        }

        pendo.track(`Text Search - ${numOfMatches > 0 ? 'Results' : 'No Results'}`, {
          searchTerm,
          numOfMatches,
        })

        onFinish(error)
      }
    }
  )
  store.on(
    types.GET_MODEL_SEARCH_RESULTS,
    (_state, { file, data, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

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
          store.dispatch(types.GET_RELATED_MODELS, {
            modelId: newModelId,
            onSomeResult: ({ modelId }) => onFinish({ modelId }),
          })

          pendo.track('Model Search Started', {
            phyndexerId: newPhyndexerId,
            modelId: `${newModelId}`,
          })
        })
        .catch(error => {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.PHYNDEXER,
            status: STATUSES.FAILURE,
            data: error,
          })
          return onError(error)
        })
    }
  )

  store.on(
    types.GET_RELATED_MODELS,
    async (_state, { modelId, onSomeResult = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

      pendo.track('More Similar Search Started', {
        modelId,
      })

      const { data, error } = await pollMatches({ modelId, store, onSomeResult })

      if (error) {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.THANGS,
          status: STATUSES.FAILURE,
          data: error,
        })
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.FAILURE,
          data: error,
        })
        onError(error)
      }

      if (data && Array.isArray(data)) {
        data.forEach(result => {
          const { collection, status, ...searchData } = result
          if (status === 'completed') {
            store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
              atom: collection,
              status: STATUSES.LOADED,
              data: { ...searchData },
            })
          } else if (status === 'error') {
            store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
              atom: collection,
              status: STATUSES.FAILURE,
              data: { ...searchData },
            })
          }
        })
      }

      pendo.track(
        `More Similar Search - ${data.matchCount > 0 ? 'Results' : 'No Results'}`,
        {
          modelId,
          numOfMatches: data.matchCount,
        }
      )
    }
  )
}
