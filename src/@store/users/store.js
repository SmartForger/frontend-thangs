import * as R from 'ramda'
import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

const COLLECTION_PREFIX = 'user'
const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on(types.INIT_USER, (_, { id }) => ({
    [`user-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(types.CHANGE_USER_STATUS, (state, { atom, status = STATUSES.INIT, data }) => ({
    [atom]: {
      ...state[atom],
      ...getStatusState(status),
      data,
    },
  }))
  store.on(types.FETCH_USER, async (_, { id }) => {
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
    }
  })

  store.on(types.UPDATE_USER, async (_, { id }) => {
    console.log('This will point to a new update user endpoint', id)
    // logger.error('Error when trying to update the user', error) //use if
  })
  store.on(
    `follow-${COLLECTION_PREFIX}`,
    async (_, { id, onFinish = noop, onError = noop }) => {
      store.dispatch('change-status', {
        status: STATUSES.LOADING,
        atom: `follow-${COLLECTION_PREFIX}`,
      })

      const { data, error } = await api({
        method: 'POST',
        endpoint: `users/${id}/follow`,
      })

      if (error) {
        store.dispatch('change-status', {
          status: STATUSES.FAILURE,
          atom: `follow-${COLLECTION_PREFIX}`,
        })
        onError()
      } else {
        store.dispatch('change-status', {
          status: STATUSES.LOADED,
          atom: `follow-${COLLECTION_PREFIX}`,
          data,
        })

        onFinish()
        store.dispatch(`local-follow-${COLLECTION_PREFIX}`, { id, isFollowed: true })
      }
    }
  )
  store.on(
    `unfollow-${COLLECTION_PREFIX}`,
    async (_, { id, onFinish = noop, onError = noop }) => {
      store.dispatch('change-status', {
        status: STATUSES.LOADING,
        atom: `unfollow-${COLLECTION_PREFIX}`,
      })

      const { data, error } = await api({
        method: 'DELETE',
        endpoint: `users/${id}/unfollow`,
      })

      if (error) {
        store.dispatch('change-status', {
          status: STATUSES.FAILURE,
          atom: `unfollow-${COLLECTION_PREFIX}`,
        })
        onError()
      } else {
        store.dispatch('change-status', {
          status: STATUSES.LOADED,
          atom: `unfollow-${COLLECTION_PREFIX}`,
          data,
        })

        onFinish()
        store.dispatch(`local-follow-${COLLECTION_PREFIX}`, { id, isFollowed: false })
      }
    }
  )

  store.on(`local-follow-${COLLECTION_PREFIX}`, (state, { id, isFollowed = false }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
      ...state[`${COLLECTION_PREFIX}-${id}`],
      data: {
        ...state[`${COLLECTION_PREFIX}-${id}`].data,
        isBeingFollowedByRequester: isFollowed,
      }
    },
  }))
}
