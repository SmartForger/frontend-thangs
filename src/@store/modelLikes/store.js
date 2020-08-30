import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, _ => ({
    'like-model': {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_LIKE_MODEL_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.POST_LIKE_MODEL, async (_, { modelId, currentUserId }) => {
    store.dispatch(types.CHANGE_LIKE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${modelId}/like`,
    })

    if (error) {
      store.dispatch(types.CHANGE_LIKE_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: `like-model-${modelId}`,
      })
    } else {
      store.dispatch(types.CHANGE_LIKE_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: 'like-model',
        data,
      })
      store.dispatch(types.UPDATE_MODEL_LIKES, {
        modelId: modelId,
        currentUserId: currentUserId,
      })
    }
  })

  store.on(types.DELETE_LIKE_MODEL, async (_, { modelId, currentUserId }) => {
    store.dispatch(types.CHANGE_LIKE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${modelId}/unlike`,
    })

    if (error) {
      store.dispatch(types.CHANGE_LIKE_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'like-model',
      })
    } else {
      store.dispatch(types.CHANGE_LIKE_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: 'like-model',
        data,
      })
      store.dispatch(types.UPDATE_MODEL_LIKES, {
        modelId: modelId,
        currentUserId: currentUserId,
      })
    }
  })
}
