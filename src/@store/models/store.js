import api from '@services/api'
import * as R from 'ramda'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'
import { logger } from '@utilities/logging'
import { authenticationService } from '@services'

const noop = () => null
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
      ...state,
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_MODEL, async (state, { id, onFinish = noop }) => {
    store.dispatch(types.CHANGE_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: `model-${id}`,
    })
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
  })

  store.on(
    types.UPDATE_MODEL,
    async (_, { id, model: updatedModel, onError = noop, onFinish = noop }) => {
      if (R.isNil(id)) return
      const currentUserId = authenticationService.getCurrentUserId()

      store.dispatch(types.CHANGE_MODEL_STATUS, {
        status: STATUSES.LOADING,
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
        store.dispatch(types.FETCH_USER_OWN_MODELS, { id: currentUserId, onFinish })
      }
    }
  )
}
