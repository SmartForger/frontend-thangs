import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on('init-user-liked-models', (_, { id }) => ({
    [`user-liked-models-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    'change-user-liked-models-status',
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on('fetch-user-liked-models', async (_, { id }) => {
    store.dispatch('change-user-liked-models-status', {
      status: STATUSES.LOADING,
      atom: `user-liked-models-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${id}/likes`,
    })

    if (error) {
      store.dispatch('change-user-liked-models-status', {
        status: STATUSES.FAILURE,
        atom: `user-liked-models-${id}`,
      })
    } else {
      store.dispatch('change-user-liked-models-status', {
        status: STATUSES.LOADED,
        atom: `user-liked-models-${id}`,
        data,
      })
    }
  })
}
