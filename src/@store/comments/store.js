import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    'new-model-comments': getStatusState(STATUSES.INIT),
  }))

  store.on('init-model-comments', (_, { id }) => ({
    [`model-comments-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on('change-comment-status', (state, { atom, status = STATUSES.INIT, data }) => ({
    [atom]: {
      ...state[atom],
      ...getStatusState(status),
      data,
    },
  }))
  store.on('fetch-model-comments', async (_, { id }) => {
    store.dispatch('change-comment-status', {
      status: STATUSES.LOADING,
      atom: `model-comments-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${id}/comments`,
    })

    if (error) {
      store.dispatch('change-comment-status', {
        status: STATUSES.FAILURE,
        atom: `model-comments-${id}`,
      })
    } else {
      store.dispatch('change-comment-status', {
        status: STATUSES.LOADED,
        atom: `model-comments-${id}`,
        data,
      })
    }
  })
  store.on(
    'new-model-comments',
    async (_, { id, body, onFinish = noop, onError = noop }) => {
      store.dispatch('change-comment-status', {
        status: STATUSES.LOADING,
        atom: 'new-model-comments',
      })

      const { data, error } = await api({
        method: 'POST',
        endpoint: `models/${id}/comments`,
        body: {
          body,
        },
      })

      if (error) {
        store.dispatch('change-comment-status', {
          status: STATUSES.FAILURE,
          atom: 'new-model-comments',
        })
        onError()
      } else {
        store.dispatch('change-comment-status', {
          status: STATUSES.LOADED,
          atom: 'new-model-comments',
          data,
        })

        onFinish()
        store.dispatch('fetch-model-comments', { id })
      }
    }
  )
}
