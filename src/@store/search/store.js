import api from '@services/api'
import { storageService, intervalRequest } from '@services'
import apiForChain from '@services/api/apiForChain'
import { getStatusState, STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const ATOMS = {
  TEXT: 'text',
  THANGS: 'thangs',
  PHYNDEXER: 'phyndexer',
  UPLOAD_DATA: 'uploadData',
}

const SEARCH_RESULT_SIZE = 50

const getStatus = intervalRequest(
  ({ modelId }) => async (resolve, reject, cancelToken) => {
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/status/${modelId}`,
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

const noop = () => null
const getInitAtom = () => ({
  [ATOMS.TEXT]: {
    ...getStatusState(STATUSES.INIT),
    data: [],
    pageToLoad: 0,
  },
  [ATOMS.THANGS]: {
    ...getStatusState(STATUSES.INIT),
    data: [],
    pageToLoad: 0,
  },
  [ATOMS.PHYNDEXER]: {
    ...getStatusState(STATUSES.INIT),
    isPollingError: false,
    data: [],
    pageToLoad: 0,
  },
  [ATOMS.UPLOAD_DATA]: {
    ...getStatusState(STATUSES.INIT),
    data: {},
  },
  polygonCount: null,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    searchResults: getInitAtom(),
  }))

  store.on(types.CHANGE_SEARCH_RESULTS_STATUS, (state, { atom, status, isInitial }) => ({
    searchResults: {
      ...state.searchResults,
      [atom]: {
        ...state.searchResults[atom],
        ...getStatusState(status),
        ...(isInitial && { data: [], pageToLoad: 1 }),
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

  store.on(types.LOADED_SEARCH_RESULTS, (state, { atom, data, isInitial }) => ({
    searchResults: {
      ...state.searchResults,
      ...getStatusState(STATUSES.LOADED),
      [atom]: {
        ...state.searchResults[atom],
        data: isInitial ? data : [...state.searchResults[atom].data, ...data],
        pageToLoad: isInitial
          ? 1
          : state.searchResults[atom].pageToLoad +
            Math.floor(data.length / SEARCH_RESULT_SIZE),
      },
    },
  }))

  store.on(
    types.FETCH_TEXT_SEARCH_RESULTS,
    async (
      state,
      {
        isInitial = false,
        onError = noop,
        onFinish = noop,
        pageCount = 1,
        scope,
        searchTerm,
      }
    ) => {
      if (!state.searchResults[ATOMS.TEXT].isLoading) {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.TEXT,
          status: STATUSES.LOADING,
          data:
            state &&
            state.searchResults &&
            state.searchResults[ATOMS.TEXT] &&
            state.searchResults[ATOMS.TEXT].data,
          isInitial,
        })
        const { data = [], error } = await api({
          method: 'GET',
          endpoint: 'models/search-by-text',
          params: {
            searchTerm,
            scope: scope || 'all',
            page: isInitial ? 0 : state.searchResults[ATOMS.TEXT].pageToLoad,
            pageSize: isInitial && pageCount === 1 ? 200 : SEARCH_RESULT_SIZE * pageCount,
          },
        })

        track('Text Search Started', {
          searchTerm,
          searchScope: scope,
        })

        if (error) {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.TEXT,
            status: STATUSES.FAILURE,
            data: error,
          })
          onError(error)
        } else {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.TEXT,
            status: STATUSES.LOADED,
            data:
              state &&
              state.searchResults &&
              state.searchResults[ATOMS.TEXT] &&
              state.searchResults[ATOMS.TEXT].data,
          })
          store.dispatch(types.LOADED_SEARCH_RESULTS, {
            atom: ATOMS.TEXT,
            data,
            isInitial,
          })

          track(`Text search - ${data.length > 0 ? 'Results' : 'No Results'}`, {
            searchTerm,
            searchScope: scope,
            numOfMatches: data.length,
          })

          onFinish({ data, endOfData: !data.length || data.length < SEARCH_RESULT_SIZE })
        }
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
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.UPLOAD_DATA,
        status: STATUSES.LOADING,
      })

      store.on(types.CHANGE_SEARCH_RESULTS_STATUS, state => ({
        searchResults: {
          ...state.searchResults,
          polygonCount: null,
        },
      }))

      let uploadedUrlData

      apiForChain({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })
        .then(({ data }) => {
          uploadedUrlData = data
          return storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)
        })
        .then(() => {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.UPLOAD_DATA,
            status: STATUSES.LOADED,
            data: uploadedUrlData,
          })
          return apiForChain({
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
        })
        .then(({ data: uploadedData }) => {
          const { newPhyndexerId: phyndexerId, newModelId: modelId } = uploadedData

          store.on(types.CHANGE_SEARCH_RESULTS_STATUS, state => ({
            searchResults: {
              ...state.searchResults,
              polygonCount: uploadedData.polygonCount ? uploadedData.polygonCount : null,
            },
          }))

          store.dispatch(types.GET_RELATED_MODELS, {
            modelId,
            phyndexerId,
            onFinish,
            geoSearch: true,
          })
        })
        .catch(error => {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.PHYNDEXER,
            status: STATUSES.FAILURE,
            data: error,
          })
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.THANGS,
            status: STATUSES.FAILURE,
            data: error,
          })
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.UPLOAD_DATA,
            status: STATUSES.FAILURE,
            data: error,
          })
          return onError(error)
        })
    }
  )
  store.on(
    types.GET_RELATED_MODELS,
    async (
      _state,
      { modelId, phyndexerId, onFinish = noop, onError = noop, geoRelated = true, scope }
    ) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

      if (geoRelated) {
        track('Model Search Started', {
          phyndexerId,
          modelId,
        })

        const { error: statusError } = await getStatus({
          modelId: modelId || phyndexerId,
        })
        if (statusError) {
          store.dispatch(types.ERROR_POLLING_PHYNDEXER, {
            data: statusError,
          })
        }
      } else {
        track('View Related Search Started', {
          phyndexerId,
          modelId,
        })
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/match/${modelId || phyndexerId}${
          scope ? `?scope=${scope}` : ''
        }`,
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
        let matchCount = {
          thangs: 0,
          phyndexer: 0,
        }
        if (data && Array.isArray(data)) {
          data.forEach(result => {
            const { collection, status, matches = [] } = result
            matchCount[collection] = matches.length
            if (status === 'completed') {
              store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
                atom: collection,
                status: STATUSES.LOADED,
                data: matches,
              })
            } else if (status === 'error') {
              store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
                atom: collection,
                status: STATUSES.FAILURE,
                data: matches,
              })
            }
          })
        }
        const numOfMatches = matchCount.thangs + matchCount.phyndexer
        if (geoRelated) {
          track(`Model Search - ${numOfMatches > 0 ? 'Results' : 'No Results'}`, {
            phyndexerId,
            modelId,
            thangsCount: matchCount.thangs,
            phynCount: matchCount.phyndexer,
          })
        } else {
          track(`View Related Search - ${numOfMatches > 0 ? 'Results' : 'No Results'}`, {
            phyndexerId,
            modelId,
            thangsCount: matchCount.thangs,
            phynCount: matchCount.phyndexer,
          })
        }

        onFinish({ modelId, phyndexerId })
      }
    }
  )
}
