import api from '@services/api'
import * as R from 'ramda'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { STATUSES, getStatusState } from '@store/constants'
import { track } from '@utilities/analytics'
import { removeModel, updateLike } from './updater'

const noop = () => null
export default store => {
  store.on(types.STORE_INIT, () => ({
    model: {},
  }))

  store.on(types.UPDATE_MODELS, (state, event) => ({
    model: {
      ...state.model,
      data: event,
    },
  }))

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
    async (
      state,
      { id, silentUpdate = false, forceRefresh = false, onFinish = noop, onError = noop }
    ) => {
      const { data: loadedModel = {} } = state.model
      if (!forceRefresh && loadedModel.id === id) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.LOADED,
          atom: 'model',
          data: loadedModel,
        })
        return
      }

      if (!silentUpdate) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.LOADING,
          atom: 'model',
        })
      }

      const { data, error } = await api({ method: 'GET', endpoint: `models/${id}` })
      if (error || R.isEmpty(data)) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: 'model',
        })
        onError()
      } else {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.LOADED,
          atom: 'model',
          data,
        })
        onFinish(data)
      }
    }
  )

  store.on(
    types.UPDATE_MODEL,
    async (state, { id, model: updatedModel, onError = noop, onFinish = noop }) => {
      if (R.isNil(id)) return
      const oldModel =
        (state['model'] && state['model'].data) ??
        state.models.data.find(model => model.id === id) ??
        {}
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVING,
        atom: 'model',
        data: oldModel,
      })
      const { error } = await api({
        method: 'PUT',
        endpoint: `models/${id}`,
        body: updatedModel,
      })

      if (error) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: 'model',
          data: oldModel,
        })
        onError(error.message)
      } else {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.SAVED,
          atom: 'model',
          data: { ...oldModel, ...updatedModel },
        })
        store.dispatch(types.FETCH_THANGS, {})
        onFinish()
      }
    }
  )

  store.on(
    types.DELETE_MODEL,
    async (state, { model, onError = noop, onFinish = noop }) => {
      if (R.isNil(model) || R.isEmpty(model)) return
      const { id } = model
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVING,
        atom: 'model',
      })

      const { error } = await api({
        method: 'DELETE',
        endpoint: `models/${id}`,
      })

      if (error) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: 'model',
        })
        onError(error.message)
      } else {
        onFinish()
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.SAVED,
          atom: 'model',
        })
        // state.models is found in the thangsStore
        const newModels = removeModel(model, state.models.data)
        store.dispatch(types.UPDATE_MODELS, newModels)
      }
    }
  )

  store.on(types.ADD_PART, async (state, { part, onError = noop, onFinish = noop }) => {
    const { modelId: id } = part
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.SAVING,
      atom: 'model',
    })
    const { error } = await api({
      method: 'PUT',
      endpoint: `models/${id}`,
      body: {
        message: `Add ${part.name}`,
        events: [
          {
            action: 'addedPart',
            partIdentifier: part.identifier,
          },
        ],
      },
    })

    if (error) {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'model',
      })
      onError(error.message)
    } else {
      onFinish()
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVED,
        atom: 'model',
      })
      store.dispatch(types.FETCH_THANGS, {})
    }
  })

  store.on(
    types.DELETE_PART,
    async (state, { part, onError = noop, onFinish = noop }) => {
      if (R.isNil(part) || R.isEmpty(part)) return
      const { modelId: id } = part
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVING,
        atom: 'model',
      })
      const { error } = await api({
        method: 'PUT',
        endpoint: `models/${id}`,
        body: {
          message: `Deleted ${part.name}`,
          events: [
            {
              action: 'deletedPart',
              partIdentifier: part.identifier,
            },
          ],
        },
      })

      if (error) {
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: 'model',
        })
        onError(error.message)
      } else {
        onFinish()
        store.dispatch(types.CHANGE_MODEL_STATUS, {
          status: STATUSES.SAVED,
          atom: 'model',
        })
        store.dispatch(types.FETCH_THANGS, {})
      }
    }
  )

  store.on(types.LIKE_MODEL, async (state, { model, onError = noop }) => {
    const id = model.id
    const currentUserId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })

    store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-liked-models-${currentUserId}`,
      data: R.pathOr({}, [`user-liked-models-${currentUserId}`, 'data'], state),
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
      onError()
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
      const newLikes = updateLike(model, state, currentUserId, true)
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-liked-models-${currentUserId}`,
        data: newLikes,
      })
      store.dispatch(types.LOCAL_UPDATE_LIKES, {
        modelId: model.id,
        isLiked: true,
      })
    }
  })

  store.on(types.UNLIKE_MODEL, async (state, { model, onError = noop }) => {
    const id = model.id
    const currentUserId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-liked-models-${currentUserId}`,
      data: R.pathOr({}, [`user-liked-models-${currentUserId}`, 'data'], state),
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
      onError()
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

      const newLikes = updateLike(model, state, currentUserId, false)
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-liked-models-${currentUserId}`,
        data: newLikes,
      })
      store.dispatch(types.LOCAL_UPDATE_LIKES, {
        modelId: model.id,
        isLiked: false,
      })
    }
  })

  store.on(
    types.LIKE_MODEL_CARD,
    async (
      _state,
      { modelId, isLiked, onFinish = noop, onError = noop, cancelToken }
    ) => {
      const endpoint = isLiked ? `models/${modelId}/like` : `models/${modelId}/unlike`

      const { error } = await api({
        method: 'POST',
        endpoint,
        cancelToken,
      })

      if (error) {
        onError(error)
      } else {
        store.dispatch(types.LOCAL_UPDATE_LIKES, {
          modelId,
          isLiked,
        })

        const trackText = isLiked ? 'Model Liked' : 'Model Unliked'
        track(trackText, { modelId })

        const { data } = await api({
          method: 'GET',
          endpoint: `models/${modelId}`,
          cancelToken,
        })

        const { likesCount = 0 } = data || {}
        onFinish(likesCount)
      }
    }
  )

  store.on(types.LOCAL_FOLLOW_MODEL_OWNER, async (state, { isFollowing }) => {
    const model = state['model'].data
    model.owner.isBeingFollowedByRequester = !isFollowing

    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADED,
      atom: 'model',
      data: { ...model },
    })
  })
}
