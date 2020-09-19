import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.INIT_USER_ID, (_, { id }) => ({
    [`user-id-${id}`]: {
      ...getStatusState(STATUSES.INIT),
    },
  }))
  store.on(
    types.CHANGE_USER_ID_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_USER_ID, async (_, { id }) => {
    store.dispatch(types.CHANGE_USER_ID_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-id-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/portfolio/${id}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_ID_STATUS, {
        status: STATUSES.FAILURE,
        atom: `user-id-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_USER_ID_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-id-${id}`,
        data: data.userId,
      })
    }
  })
}
