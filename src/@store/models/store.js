import api from '@services/api'
import * as R from 'ramda'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { STATUSES, getStatusState } from '@store/constants'
import { logger } from '@utilities/logging'
import { track } from '@utilities/analytics'

const noop = () => null
export default store => {
  store.on(
    types.CHANGE_MODEL_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      ...state,
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(
    types.FETCH_MODEL,
    async (state, { id, onFinish = noop, silentUpdate = false }) => {
      if (!silentUpdate) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.LOADING,
          atom: `model-${id}`,
        })
      }
      const { data, error } = await api({ method: 'GET', endpoint: `models/${id}` })
      if (error || R.isEmpty(data)) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: `model-${id}`,
        })
      } else {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.LOADED,
          atom: `model-${id}`,
          data,
        })

        store.dispatch(types.FETCH_USER, { id: data.owner.id, onFinish })
      }
    }
  )

  store.on(
    types.UPDATE_MODEL,
    async (_, { id, model: updatedModel, onError = noop, onFinish = noop }) => {
      if (R.isNil(id)) return
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVING,
        atom: `model-${id}`,
      })
      const { error } = await api({
        method: 'PUT',
        endpoint: `models/${id}`,
        body: updatedModel,
      })

      if (error) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: `model-${id}`,
        })
        onError(error.message)
        logger.error('Error when trying to update the model', error)
      } else {
        onFinish()
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.SAVED,
          atom: `model-${id}`,
        })
        store.dispatch(types.FETCH_THANGS, {})
      }
    }
  )

  store.on(
    types.DELETE_MODEL,
    async (_, { id, onError = noop, onFinish = noop, folderId }) => {
      if (R.isNil(id)) return
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVING,
        atom: `model-${id}`,
      })

      const { error } = await api({
        method: 'DELETE',
        endpoint: `models/${id}`,
      })

      if (error) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: `model-${id}`,
        })
        onError(error.message)
        logger.error('Error when trying to update the model', error)
      } else {
        onFinish()
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.SAVED,
          atom: `model-${id}`,
        })
        store.dispatch(types.FETCH_THANGS, { silentUpdate: true })
      }
    }
  )

  store.on(types.LIKE_MODEL, async (_, { id, owner }) => {
    const currentUserId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${id}/like`,
    })

    if (error) {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: `like-model-${id}`,
      })
    } else {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: 'like-model',
        data,
      })
      track('Model Liked', { id })
      store.dispatch(types.FETCH_MODEL, {
        id,
        silentUpdate: true,
      })
      if (owner.id === currentUserId) {
        store.dispatch(types.FETCH_USER_LIKED_MODELS, {
          id: currentUserId,
          silentUpdate: true,
        })
        store.dispatch(types.FETCH_THANGS, { silentUpdate: true })
      }
    }
  })

  store.on(types.UNLIKE_MODEL, async (_, { id, owner }) => {
    const currentUserId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${id}/unlike`,
    })

    if (error) {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'like-model',
      })
    } else {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: 'like-model',
        data,
      })
      track('Model Unliked', { id })
      store.dispatch(types.FETCH_MODEL, {
        id,
        silentUpdate: true,
      })
      if (owner.id === currentUserId) {
        store.dispatch(types.FETCH_USER_LIKED_MODELS, {
          id: currentUserId,
          silentUpdate: true,
        })
        store.dispatch(types.FETCH_THANGS, { silentUpdate: true })
      }
    }
  })
}
