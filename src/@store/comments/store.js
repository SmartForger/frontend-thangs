import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    'new-model-comments': getStatusState(STATUSES.INIT),
  }))

  store.on(types.INIT_MODEL_COMMENTS, (_, { id }) => ({
    [`model-comments-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_MODEL_COMMENTS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_MODEL_COMMENTS, async (_, { id }) => {
    store.dispatch(types.CHANGE_MODEL_COMMENTS, {
      status: STATUSES.LOADING,
      atom: `model-comments-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${id}/comments`,
    })

    if (error) {
      store.dispatch(types.CHANGE_MODEL_COMMENTS, {
        status: STATUSES.FAILURE,
        atom: `model-comments-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_MODEL_COMMENTS, {
        status: STATUSES.LOADED,
        atom: `model-comments-${id}`,
        data,
      })
    }
  })
  store.on(
    types.NEW_MODEL_COMMENTS,
    async (_, { id, body, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_MODEL_COMMENTS, {
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
        store.dispatch(types.CHANGE_MODEL_COMMENTS, {
          status: STATUSES.FAILURE,
          atom: 'new-model-comments',
        })
        onError()
      } else {
        store.dispatch(types.CHANGE_MODEL_COMMENTS, {
          status: STATUSES.LOADED,
          atom: 'new-model-comments',
          data,
        })
        pendo.track('New Comment', { modelId: id })
        onFinish()
        store.dispatch(types.FETCH_MODEL_COMMENTS, { id })
      }
    }
  )
}
