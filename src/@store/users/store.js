import * as R from 'ramda'
import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import { authenticationService } from '@services'
import * as types from '@constants/storeEventTypes'
import { logger } from '@utilities/logging'

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    currentUser: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))

  store.on(types.INIT_USER, (_, { id }) => {
    if (R.isNil(id)) return

    return {
      [`user-${id}`]: {
        ...getStatusState(STATUSES.INIT),
        data: {},
      },
    }
  })

  store.on(types.CHANGE_USER_STATUS, (state, { atom, status = STATUSES.INIT, data }) => ({
    [atom]: {
      ...state[atom],
      ...getStatusState(status), 
      ...(data && { data }),
    },
  }))

  store.on(types.FETCH_USER, async (_, { id, silentUpdate = false, onFinish = noop }) => {
    if (R.isNil(id)) return

    if (!silentUpdate) {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.LOADING,
        atom: `user-${id}`,
      })
    }

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
      onFinish()
    }
  })

  store.on(
    types.UPDATE_USER,
    async (_, { id, user: updatedUser, onError = noop, onFinish = noop }) => {
      if (R.isNil(id)) return

      const { error } = await api({
        method: 'PUT',
        endpoint: `users/${id}`,
        body: updatedUser,
      })

      if (error) {
        onError(
          (error.response && error.response.data && error.response.data.message) ||
            'Something has gone wrong. Please try again'
        )
        logger.error('Error when trying to update the user', error)
      } else {
        store.dispatch(types.FETCH_CURRENT_USER, { onFinish })
      }
    }
  )

  store.on(types.FOLLOW_USER, async (_, { id, onFinish = noop, onError = noop }) => {
    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: types.FOLLOW_USER,
    })

    const { data, error } = await api({
      method: 'POST',
      endpoint: `users/${id}/follow`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.FAILURE,
        atom: types.FOLLOW_USER,
      })
      onError()
    } else {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.LOADED,
        atom: types.FOLLOW_USER,
        data,
      })

      onFinish()
    }
  })

  store.on(types.UNFOLLOW_USER, async (_, { id, onFinish = noop, onError = noop }) => {
    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: types.UNFOLLOW_USER,
    })

    const { data, error } = await api({
      method: 'DELETE',
      endpoint: `users/${id}/unfollow`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.FAILURE,
        atom: types.UNFOLLOW_USER,
      })
      onError()
    } else {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.LOADED,
        atom: types.UNFOLLOW_USER,
        data,
      })

      onFinish()
    }
  })

  store.on(types.LOCAL_INVERT_FOLLOW_USER, async (state, { id }) => {
    const user = state[`user-${id}`].data
    user.isBeingFollowedByRequester = !user.isBeingFollowedByRequester

    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADED,
      atom: `user-${id}`,
      data: {...user},
    })
  })

  store.on(types.FETCH_CURRENT_USER, async (_, { onFinish = noop }) => {
    const userId = authenticationService.getCurrentUserId()
    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: 'currentUser',
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${userId}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'currentUser',
        data: {},
      })
    } else {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.LOADED,
        atom: 'currentUser',
        data,
      })
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-${userId}`,
        data,
      })
      onFinish()
    }
  })

  store.on(types.RESET_CURRENT_USER, () => {
    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.INIT,
      atom: 'currentUser',
      data: {},
    })
  })
}
