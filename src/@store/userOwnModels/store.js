import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on('init-user-own-models', (_, { id }) => ({
    [`user-own-models-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    'change-user-own-models-status',
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on('fetch-user-own-models', async (_, { id }) => {
    store.dispatch('change-user-own-models-status', {
      status: STATUSES.LOADING,
      atom: `user-own-models-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${id}/models`,
    })

    if (error) {
      store.dispatch('change-user-own-models-status', {
        status: STATUSES.FAILURE,
        atom: `user-own-models-${id}`,
      })
    } else {
      store.dispatch('change-user-own-models-status', {
        status: STATUSES.LOADED,
        atom: `user-own-models-${id}`,
        data,
      })
    }
  })
}
