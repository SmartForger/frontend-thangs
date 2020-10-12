import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on(types.INIT_USER_LIKED_MODELS, (_, { id }) => ({
    [`user-liked-models-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_USER_LIKED_MODELS_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_USER_LIKED_MODELS, async (_, { id, silentUpdate = false }) => {
    if (!silentUpdate) {
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.LOADING,
        atom: `user-liked-models-${id}`,
      })
    }
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${id}/likes`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.FAILURE,
        atom: `user-liked-models-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-liked-models-${id}`,
        data,
      })
    }
  })
}
