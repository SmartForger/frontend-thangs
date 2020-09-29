import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { FETCH_TYPES } from './consts'

const noop = () => null
export default store => {
  store.on(types.INIT_USER_OWN_MODELS, (_, { id }) => ({
    [`user-own-models-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_USER_OWNED_MODELS_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      ...state,
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_USER_OWN_MODELS, async (_, { id, onFinish = noop }) => {
    store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-own-models-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${id}/models?sortBy=date`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
        status: STATUSES.FAILURE,
        atom: `user-own-models-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-own-models-${id}`,
        data,
      })
      onFinish()
    }
  })

  store.on(types.DELETE_USER_OWN_MODEL, async (_, { id, fetchData, onFinish = noop }) => {
    const currentUserId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-own-models-${currentUserId}`,
    })
    const { data, error } = await api({
      method: 'DELETE',
      endpoint: `models/${id}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
        status: STATUSES.FAILURE,
        atom: `user-own-models-${currentUserId}`,
      })
    } else {
      store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-own-models-${currentUserId}`,
        data,
      })

      if (fetchData.type === FETCH_TYPES.FOLDER) {
        store.dispatch(types.FETCH_FOLDER, {
          folderId: fetchData.folderId,
          onFinish,
        })
      } else {
        store.dispatch(types.FETCH_USER_OWN_MODELS, {
          id: currentUserId,
          onFinish,
        })
      }
    }
  })
}
