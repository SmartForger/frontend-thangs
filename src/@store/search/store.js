import api from '@services/api'
import { storageService, intervalRequest } from '@services'
import apiForChain from '@services/api/apiForChain'
import { getStatusState, STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const ATOMS = {
  THANGS: 'thangs',
  PHYNDEXER: 'phyndexer',
  TEXT: 'text',
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
  [ATOMS.TEXT]: {
    ...getStatusState(STATUSES.INIT),
    data: {},
  },
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    searchResults: getInitAtom(),
  }))

  store.on('change-search-results-status', (state, { atom, status, data }) => ({
    searchResults: {
      ...state.searchResults,
      [atom]: {
        ...getStatusState(status),
        data: status === STATUSES.LOADING ? {} : data,
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
    async (_state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch('change-search-results-status', {
        atom: ATOMS.TEXT,
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
        store.dispatch('change-search-results-status', {
          atom: ATOMS.TEXT,
          status: STATUSES.FAILURE,
          data: error,
        })
        onError(error)
      } else {
        store.dispatch('change-search-results-status', {
          atom: ATOMS.TEXT,
          status: STATUSES.LOADED,
          data: { matches: data },
        })
        pendo.track(
          `Text Search - ${
            data && data.length && data.length > 0 ? 'Results' : 'No Results'
          }`,
          {
            searchTerm,
            numOfMatches: (data && data.length) || 0,
          }
        )

        onFinish(error)
      }
    }
  )
  store.on(
    'get-search-results-by-model',
    (_state, { file, data, onFinish = noop, onError = noop }) => {
      store.dispatch('change-search-results-status', {
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

          store.dispatch('get-related-models-via-phyndexer', {
            newPhyndexerId,
            newModelId,
            onFinish,
          })

          pendo.track('Model Search Started', {
            phyndexerId: newPhyndexerId,
            modelId: newModelId,
          })
        })
        .catch(error => {
          store.dispatch('change-search-results-status', {
            atom: ATOMS.PHYNDEXER,
            status: STATUSES.FAILURE,
            data: error,
          })
          return onError(error)
        })
    }
  )
  store.on(
    'get-related-models-via-thangs',
    (_state, { modelId, onFinish = noop, onError = noop }) => {
      if (!modelId) return
      store.dispatch('change-search-results-status', {
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
          store.dispatch('change-search-results-status', {
            atom: ATOMS.THANGS,
            status: STATUSES.LOADED,
            data: data,
          })
          pendo.track(
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
          store.dispatch('change-search-results-status', {
            atom: ATOMS.THANGS,
            status: STATUSES.FAILURE,
            data: error,
          })
          return onError(error)
        })
    }
  )
  store.on(
    'get-related-models-via-phyndexer',
    async (_state, { newPhyndexerId, newModelId, onFinish = noop, onError = noop }) => {
      if (!newPhyndexerId) return
      store.dispatch('change-search-results-status', {
        atom: ATOMS.PHYNDEXER,
        status: STATUSES.LOADING,
      })

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
        store.dispatch('change-search-results-status', {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.FAILURE,
          data: error,
        })
        onFinish({ modelId: newModelId })
        return onError(error)
      } else {
        store.dispatch('change-search-results-status', {
          atom: ATOMS.PHYNDEXER,
          status: STATUSES.LOADED,
          data,
        })
        pendo.track(
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
        onFinish({ modelId: newModelId })
      }
    }
  )
}
