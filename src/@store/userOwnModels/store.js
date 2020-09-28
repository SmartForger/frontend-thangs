import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { FETCH_TYPES } from './consts'

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
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_USER_OWN_MODELS, async (_, { id }) => {
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
    }
  })

  store.on(types.DELETE_USER_OWN_MODEL, async (_, { modelId, fetchData }) => {
    const currentUserId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-own-models-${currentUserId}`,
    })
    const { data, error } = await api({
      method: 'DELETE',
      endpoint: `models/${modelId}`,
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
        })
      } else {
        store.dispatch(types.FETCH_USER_OWN_MODELS, {
          id: currentUserId,
        })
      }
    }
  })
}
