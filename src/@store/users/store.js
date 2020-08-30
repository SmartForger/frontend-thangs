import * as R from 'ramda'
import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on(types.INIT_USER, (_, { id }) => ({
    [`user-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(types.CHANGE_USER_STATUS, (state, { atom, status = STATUSES.INIT, data }) => ({
    [atom]: {
      ...state[atom],
      ...getStatusState(status),
      data,
    },
  }))
  store.on(types.FETCH_USER, async (_, { id }) => {
    if (R.isNil(id)) return

    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${id}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.FAILURE,
        atom: `user-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-${id}`,
        data,
      })
    }
  })

  store.on(types.UPDATE_USER, async (_, { id }) => {
    console.log('This will point to a new update user endpoint', id)
    // logger.error('Error when trying to update the user', error) //use if
  })
}
