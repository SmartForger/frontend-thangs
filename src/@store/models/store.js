import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'
import { authenticationService } from '@services'
import { FETCH_TYPES } from './consts'

export default store => {
  store.on(types.STORE_INIT, () => ({
    deleteModel: getStatusState(STATUSES.INIT),
  }))

  store.on(types.INIT_MODEL, (_, { id }) => ({
    [`model-${id}`]: { ...getStatusState(STATUSES.INIT), data: {} },
  }))

  store.on(types.UPDATE_MODEL_LIKES, (state, { modelId, currentUserId }) => {
    let likes = state[`model-${modelId}`].data.likes
    const index = likes.indexOf(currentUserId)
    if (likes.includes(currentUserId)) {
      likes.splice(index, 1)
    } else {
      likes.push(currentUserId)
    }
    return {
      [`model-${modelId}`]: {
        ...state[`model-${modelId}`],
        data: {
          ...state[`model-${modelId}`].data,
          likes: likes,
        },
      },
    }
  })

  store.on(
    types.CHANGE_MODEL_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_MODEL, async (state, { id }) => {
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: `model-${id}`,
    })
    const { data, error } = await api({ method: 'GET', endpoint: `models/${id}` })
    if (error) {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.ERROR,
        atom: `model-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: `model-${id}`,
        data,
      })
    }
  })

  store.on(types.DELETE_MODEL, async (_, { 
    modelId, 
    fetchData,
  }) => {
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'deleteModel',
    })
    const { data, error } = await api({
      method: 'DELETE',
      endpoint: `models/${modelId}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'deleteModel',
      })
    } else {
      store.dispatch(types.CHANGE_USER_OWNED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: 'deleteModel',
        data,
      })

      if (fetchData.type === FETCH_TYPES.FOLDER) {
        store.dispatch(types.FETCH_FOLDER, {
          folderId: fetchData.folderId,
        })
      } else {
        store.dispatch(types.FETCH_USER_OWN_MODELS, {
          id: authenticationService.getCurrentUserId(),
        })
      }
      
    }
  })
}
