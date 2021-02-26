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
  },
  [ATOMS.THANGS]: {
    ...getStatusState(STATUSES.INIT),
    data: [],
  },
  [ATOMS.PHYNDEXER]: {
    ...getStatusState(STATUSES.INIT),
    isPollingError: false,
    data: [],
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

  store.on(types.CHANGE_SEARCH_RESULTS_STATUS, (state, { atom, status, data }) => ({
    searchResults: {
      ...state.searchResults,
      [atom]: {
        ...getStatusState(status),
        ...(data && { data }),
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
    async (state, { searchTerm, scope, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.TEXT,
        status: STATUSES.LOADING,
        data:
          state &&
          state.searchResults &&
          state.searchResults[ATOMS.TEXT] &&
          state.searchResults[ATOMS.TEXT].data,
      })

      const { data = [], error } = await api({
        method: 'GET',
        endpoint: 'models/search-by-text',
        params: { searchTerm, scope: scope && scope !== 'all' ? scope : '' },
      })

      track('Text Search Started', {
        searchTerm,
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
          data,
        })

        track(`Text search - ${data.length > 0 ? 'Results' : 'No Results'}`, {
          searchTerm,
          numOfMatches: data.length,
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
      {
        modelId,
        phyndexerId,
        onFinish = noop,
        onError = noop,
        geoRelated = true,
        geoSearch = false,
      }
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
          !geoSearch && !modelId ? '?scope=phyn' : ''
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
