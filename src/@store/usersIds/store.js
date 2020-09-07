import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

const COLLECTION_NAME = 'user-id'

export default store => {
  store.on(types.INIT_USER_ID, (_, { id }) => ({
    [`${COLLECTION_NAME}-${id}`]: {
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
      atom: `${COLLECTION_NAME}-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/portfolio/${id}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_ID_STATUS, {
        status: STATUSES.FAILURE,
        atom: `${COLLECTION_NAME}-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_USER_ID_STATUS, {
        status: STATUSES.LOADED,
        atom: `${COLLECTION_NAME}-${id}`,
        data: data.userId,
      })
    }
  })
}
