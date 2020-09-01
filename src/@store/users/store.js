import * as R from 'ramda'
import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
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
      data,
    },
  }))
  store.on(types.FETCH_USER, async (_, { id, onFinish = noop }) => {
    if (R.isNil(id)) return

    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-${id}`,
    })
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
  store.on(types.UPDATE_USER_AVATAR, (state, { userId, data }) => {
    return {
      [`user-${userId}`]: {
        ...state[`user-${userId}`],
        data: {
          ...state[`user-${userId}`].data,
          profile: {
            ...state[`user-${userId}`].data.profile,
            avatarUrl: data,
          },
        },
      },
    }
  })
  store.on(types.UPDATE_USER, async (_, { id, user: updatedUser, onFinish = noop }) => {
    if (R.isNil(id)) return

    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-${id}`,
    })
    const { error } = await api({
      method: 'PUT',
      endpoint: `users/${id}`,
      body: updatedUser,
    })

    if (error) {
      store.dispatch(types.CHANGE_USER_STATUS, {
        status: STATUSES.FAILURE,
        atom: `user-${id}`,
      })
      logger.error('Error when trying to update the user', error)
    } else {
      store.dispatch(types.FETCH_CURRENT_USER, { id, onFinish })
    }
  })
  store.on('follow-user', async (_, { id, onFinish = noop, onError = noop }) => {
    store.dispatch('change-status', {
      status: STATUSES.LOADING,
      atom: 'follow-user',
    })

    const { data, error } = await api({
      method: 'POST',
      endpoint: `users/${id}/follow`,
    })

    if (error) {
      store.dispatch('change-status', {
        status: STATUSES.FAILURE,
        atom: 'follow-user',
      })
      onError()
    } else {
      store.dispatch('change-status', {
        status: STATUSES.LOADED,
        atom: 'follow-user',
        data,
      })

      onFinish()
      store.dispatch('local-follow-user', { id, isFollowed: true })
    }
  })
  store.on('unfollow-user', async (_, { id, onFinish = noop, onError = noop }) => {
    store.dispatch('change-status', {
      status: STATUSES.LOADING,
      atom: 'unfollow-user',
    })

    const { data, error } = await api({
      method: 'DELETE',
      endpoint: `users/${id}/unfollow`,
    })

    if (error) {
      store.dispatch('change-status', {
        status: STATUSES.FAILURE,
        atom: 'unfollow-user',
      })
      onError()
    } else {
      store.dispatch('change-status', {
        status: STATUSES.LOADED,
        atom: 'unfollow-user',
        data,
      })

      onFinish()
      store.dispatch('local-follow-user', { id, isFollowed: false })
    }
  })

  store.on('local-follow-user', (state, { id, isFollowed = false }) => ({
    [`user-${id}`]: {
      ...state[`user-${id}`],
      data: {
        ...state[`user-${id}`].data,
        isBeingFollowedByRequester: isFollowed,
      },
    },
  }))
  store.on(types.FETCH_CURRENT_USER, async (_, { id, onFinish = noop }) => {
    store.dispatch(types.CHANGE_USER_STATUS, {
      status: STATUSES.LOADING,
      atom: 'currentUser',
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/${id}`,
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
