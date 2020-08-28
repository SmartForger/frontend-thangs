import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

const COLLECTION_PREFIX = 'model-comments'

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    [`new-${COLLECTION_PREFIX}`]: getStatusState(STATUSES.INIT),
  }))

  store.on(`init-${COLLECTION_PREFIX}`, (_, { id }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on('change-status', (state, { atom, status = STATUSES.INIT, data }) => ({
    [atom]: {
      ...state[atom],
      ...getStatusState(status),
      data,
    },
  }))
  store.on(`fetch-${COLLECTION_PREFIX}`, async (_, { id }) => {
    store.dispatch('change-status', {
      status: STATUSES.LOADING,
      atom: `${COLLECTION_PREFIX}-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${id}/comments`,
    })

    if (error) {
      store.dispatch('change-status', {
        status: STATUSES.FAILURE,
        atom: `${COLLECTION_PREFIX}-${id}`,
      })
    } else {
      store.dispatch('change-status', {
        status: STATUSES.LOADED,
        atom: `${COLLECTION_PREFIX}-${id}`,
        data,
      })
    }
  })
  store.on(
    `new-${COLLECTION_PREFIX}`,
    async (_, { id, body, onFinish = noop, onError = noop }) => {
      store.dispatch('change-status', {
        status: STATUSES.LOADING,
        atom: `new-${COLLECTION_PREFIX}`,
      })

      const { data, error } = await api({
        method: 'POST',
        endpoint: `models/${id}/comments`,
        body: {
          body,
        },
      })

      if (error) {
        store.dispatch('change-status', {
          status: STATUSES.FAILURE,
          atom: `new-${COLLECTION_PREFIX}`,
        })
        onError()
      } else {
        store.dispatch('change-status', {
          status: STATUSES.LOADED,
          atom: `new-${COLLECTION_PREFIX}`,
          data,
        })

        onFinish()
        store.dispatch(`fetch-${COLLECTION_PREFIX}`, { id })
      }
    }
  )
}
