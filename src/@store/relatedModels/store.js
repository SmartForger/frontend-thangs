import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on(types.INIT_RELATED_MODELS, (_, { id }) => ({
    [`related-models-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_RELATED_MODELS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_RELATED_MODELS, async (_, { id }) => {
    store.dispatch(types.CHANGE_RELATED_MODELS, {
      status: STATUSES.LOADING,
      atom: `related-models-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/related/${id}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_RELATED_MODELS, {
        status: STATUSES.FAILURE,
        atom: `related-models-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_RELATED_MODELS, {
        status: STATUSES.LOADED,
        atom: `related-models-${id}`,
        data,
      })
    }
  })
}
