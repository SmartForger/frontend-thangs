import * as R from 'ramda'
import api from '@services/api'
import { storageService, intervalRequest } from '@services'
import apiForChain from '@services/api/apiForChain'
import { getStatusState, STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const ATOMS = {
  THANGS: 'thangs',
  PHYNDEXER: 'phyndexer',
  UPLOAD_DATA: 'uploadData',
}

const getStatus = intervalRequest(
  ({ modelId }) => async (resolve, reject, cancelToken) => {
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/phyn-status/${modelId}`,
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
  [ATOMS.THANGS]: {
    ...getStatusState(STATUSES.INIT),
    data: {},
  },
  [ATOMS.PHYNDEXER]: {
    ...getStatusState(STATUSES.INIT),
    isPollingError: false,
    data: {},
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

  store.on(types.GET_TEXT_SEARCH_RESULTS, (_state, { searchTerm }) => {
    store.dispatch(types.GET_THANGS_TEXT_SEARCH_RESULTS, { searchTerm })
    store.dispatch(types.GET_PHYNDEXER_TEXT_SEARCH_RESULTS, { searchTerm })
  })

  store.on(
    types.GET_THANGS_TEXT_SEARCH_RESULTS,
    async (_state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })

      const { data = {}, error } = await api({
        method: 'GET',
        endpoint: 'models/search-by-text',
        params: { searchTerm },
      })
      track('Thangs Text Search Started', {
        searchTerm,
      })

      if (error) {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.THANGS,
          status: STATUSES.FAILURE,
          data: error,
        })
        onError(error)
      } else {
        const matches = R.path(['matches'], data) || []
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.THANGS,
          status: STATUSES.LOADED,
          data: { matches },
        })

        track(`Thangs Text search - ${matches.length > 0 ? 'Results' : 'No Results'}`, {
          searchTerm,
          numOfMatches: matches.length,
        })

        onFinish(error)
      }
    }
  )

  store.on(
    types.GET_PHYNDEXER_TEXT_SEARCH_RESULTS,
    async (_state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

      const { data = {}, error } = await api({
        method: 'GET',
        endpoint: 'models/search-by-phyndexer-text',
        params: { searchTerm },
      })
      track('Phyndexer Text Search Started', {
        searchTerm,
      })

      if (error) {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.FAILURE,
          data: error,
        })
        onError(error)
      } else {
        const matches = R.path(['matches'], data) || []
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.LOADED,
          data: { matches },
        })

        track(
          `Phyndexer Text search - ${matches.length > 0 ? 'Results' : 'No Results'}`,
          {
            searchTerm,
            numOfMatches: matches.length,
          }
        )

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

      const emptyMatchesTypes = []

      const handleFinish = (type, props) => {
        emptyMatchesTypes.push(type)
        if (
          (R.path(['matches', 'length'], props) || 0) > 0 ||
          (emptyMatchesTypes.includes(ATOMS.PHYNDEXER) &&
            emptyMatchesTypes.includes(ATOMS.THANGS))
        ) {
          onFinish(props)
        }
      }

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
          const { newPhyndexerId: phyndexerId } = uploadedData

          store.on(types.CHANGE_SEARCH_RESULTS_STATUS, state => ({
            searchResults: {
              ...state.searchResults,
              polygonCount: uploadedData.polygonCount ? uploadedData.polygonCount : null,
            },
          }))

          store.dispatch(types.GET_RELATED_MODELS, {
            modelId: phyndexerId,
          })

          track('Model Search Started', {
            phyndexerId,
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
    async (_state, { modelId, onFinish = noop, onError = noop, geoRelated = true }) => {
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

      if (geoRelated) {
        const { error: statusError } = await getStatus({ modelId })
        if (statusError) {
          store.dispatch(types.ERROR_POLLING_PHYNDEXER, {
            data: statusError,
          })
        }
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/match/${modelId}`,
      })

      // track('View Related Search Started', {
      //   modelId,
      // })

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
        // let numOfMatches = 0
        if (data && Array.isArray(data)) {
          data.forEach(result => {
            const { collection, status, ...searchData } = result
            // numOfMatches += searchData && searchData.matches && searchData.matches.length
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

        // track(`View Related Search - ${numOfMatches > 0 ? 'Results' : 'No Results'}`, {
        //   modelId,
        //   numOfMatches,
        // })

        onFinish()
      }
    }
  )
}
