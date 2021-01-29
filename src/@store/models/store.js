import api from '@services/api'
import * as R from 'ramda'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { STATUSES, getStatusState } from '@store/constants'
import { track } from '@utilities/analytics'
import { removeModel, updateLike } from './updater'

const noop = () => null
export default store => {
  store.on(types.UPDATE_MODELS, (state, event) => ({
    models: {
      ...state.models,
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
  store.on(types.FETCH_MODEL, async (_state, { id, silentUpdate = false }) => {
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
    } else {
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: 'model',
        data,
      })
    }
  })

  store.on(
    types.UPDATE_MODEL,
    async (state, { id, model: updatedModel, onError = noop, onFinish = noop }) => {
      if (R.isNil(id)) return
      const oldModel = (store['model'] && store['model'].data) || {}
      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.SAVING,
        atom: 'model',
        data: state.model.data,
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
          data: { ...state.model.data, ...updatedModel },
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
        const newModels = removeModel(model, state.models.data)
        store.dispatch(types.UPDATE_MODELS, newModels)
        store.dispatch(types.DELETE_MODEL_FROM_FOLDER, { model })
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
    }
  })

  store.on(
    types.LIKE_MODEL_CARD,
    async (_state, { model, onFinish = noop, onError = noop, cancelToken }) => {
      const id = model.id
      const { error } = await api({
        method: 'POST',
        endpoint: `models/${id}/like`,
        cancelToken,
      })

      if (error) {
        onError(error)
      } else {
        track('Model Liked', { id })

        const { data } = await api({
          method: 'GET',
          endpoint: `models/${id}`,
          cancelToken,
        })
        const newLikes = data.likes
        if (!R.isNil(newLikes)) {
          onFinish(newLikes)
        }
      }
    }
  )

  store.on(
    types.UNLIKE_MODEL_CARD,
    async (_state, { model, onFinish = noop, onError = noop, cancelToken }) => {
      const id = model.id
      const { error } = await api({
        method: 'POST',
        endpoint: `models/${id}/unlike`,
        cancelToken,
      })

      if (error) {
        onError(error)
      } else {
        track('Model Unliked', { id })

        const { data } = await api({
          method: 'GET',
          endpoint: `models/${id}`,
          cancelToken,
        })
        const newLikes = data.likes
        if (!R.isNil(newLikes)) {
          onFinish(newLikes)
        }
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
