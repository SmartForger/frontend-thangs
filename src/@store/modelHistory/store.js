import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'

const noop = () => null
export default store => {
  store.on(types.STORE_INIT, () => ({
    modelHistory: {
      ...getStatusState(STATUSES.INIT),
      data: [],
    },
  }))
  store.on(
    types.CHANGE_MODEL_HISTORY_STATUS,
    (state, { status = STATUSES.INIT, data, error }) => ({
      ...state,
      modelHistory: {
        ...getStatusState(status),
        data,
        error,
      },
    })
  )
  store.on(
    types.FETCH_MODEL_HISTORY,
    async (_state, { id, onFinish = noop, onError = noop }) => {
      store.dispatch(types.CHANGE_MODEL_HISTORY_STATUS, {
        status: STATUSES.LOADING,
      })

      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/${id}/history`,
      })
      if (error) {
        store.dispatch(types.CHANGE_MODEL_HISTORY_STATUS, {
          status: STATUSES.FAILURE,
          error,
        })
        onError(error)
      } else {
        store.dispatch(types.CHANGE_MODEL_HISTORY_STATUS, {
          status: STATUSES.LOADED,
          data,
        })
        onFinish(data)
      }
    }
  )
}
