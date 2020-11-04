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

  store.on(
    types.GET_TEXT_SEARCH_RESULTS,
    (_state, { searchTerm }) => {
      store.dispatch(types.GET_THANGS_TEXT_SEARCH_RESULTS, { searchTerm })
      store.dispatch(types.GET_PHYNDEXER_TEXT_SEARCH_RESULTS, { searchTerm })
    }
  )

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

        track(`Phyndexer Text search - ${matches.length > 0 ? 'Results' : 'No Results'}`, {
          searchTerm,
          numOfMatches: matches.length,
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
          const { newPhyndexerId: phyndexerId, newModelId: modelId } = uploadedData

          store.on(types.CHANGE_SEARCH_RESULTS_STATUS, state => ({
            searchResults: {
              ...state.searchResults,
              polygonCount: uploadedData.polygonCount ? uploadedData.polygonCount : null,
            },
          }))

          store.dispatch(types.GET_RELATED_MODELS_VIA_PHYNDEXER, {
            newPhyndexerId: phyndexerId,
            newModelId: modelId,
            onFinish: props => {
              handleFinish(ATOMS.PHYNDEXER, { ...props, phyndexerId, modelId })
            },
          })

          store.dispatch(types.GET_RELATED_MODELS_VIA_THANGS, {
            modelId,
            onFinish: props => {
              handleFinish(ATOMS.THANGS, { ...props, phyndexerId, modelId })
            },
          })

          track('Model Search Started', {
            phyndexerId,
            modelId: `${modelId}`,
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
    types.GET_RELATED_MODELS_VIA_THANGS,
    (_state, { modelId, onFinish = noop, onError = noop }) => {
      if (!modelId) return
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.THANGS,
        status: STATUSES.LOADING,
      })

      getThangsStatus({ modelId })
        .then(() =>
          apiForChain({
            method: 'GET',
            endpoint: `models/related/${modelId}`,
          })
        )
        .then(({ data }) => {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.THANGS,
            status: STATUSES.LOADED,
            data: data,
          })

          track(
            `Thangs Model Search - ${
              data && data.matches && data.matches.length && data.matches.length > 0
                ? 'Results'
                : 'No Results'
            }`,
            {
              modelId,
              numOfMatches: (data && data.matches && data.matches.length) || 0,
            }
          )
          onFinish(data)
        })
        .catch(error => {
          store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
            atom: ATOMS.THANGS,
            status: STATUSES.FAILURE,
            data: error,
          })
          return onError(error)
        })
    }
  )
  store.on(
    types.GET_RELATED_MODELS_VIA_PHYNDEXER,
    async (_state, { newPhyndexerId, newModelId, onFinish = noop, onError = noop }) => {
      if (!newPhyndexerId) return
      store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
        data: { newModelId },
      })

      const { error: statusError } = await getPhynStatus({ newPhyndexerId })
      if (statusError) {
        store.dispatch(types.ERROR_POLLING_PHYNDEXER, {
          data: statusError,
        })
      }

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/phyn-related/${newPhyndexerId}`,
      })

      if (error) {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.FAILURE,
          data: error,
        })
        onFinish({ modelId: newModelId, matches: [] })
        return onError(error)
      } else {
        store.dispatch(types.CHANGE_SEARCH_RESULTS_STATUS, {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.LOADED,
          data,
        })

        track(
          `Phyndexer Model Search - ${
            data && data.matches && data.matches.length && data.matches.length > 0
              ? 'Results'
              : 'No Results'
          }`,
          {
            phyndexerId: newPhyndexerId,
            numOfMatches: (data && data.matches && data.matches.length) || 0,
          }
        )
        onFinish({
          modelId: newModelId,
          phyndexerId: newPhyndexerId,
          matches: data && data.matches,
        })
      }
    }
  )
  store.on(
    types.GET_RELATED_MODELS,
    async (_state, { modelId, onFinish = noop, onError = noop }) => {
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
        endpoint: `models/match/${modelId}`,
      })

      track('View Related Search Started', {
        modelId,
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
            const { collection, status, ...searchData } = result
            numOfMatches += searchData && searchData.matches && searchData.matches.length
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

        track(`View Related Search - ${numOfMatches > 0 ? 'Results' : 'No Results'}`, {
          modelId,
          numOfMatches,
        })

        onFinish()
      }
    }
  )
}
