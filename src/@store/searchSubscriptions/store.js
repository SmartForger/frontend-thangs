import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({
    searchSubscriptions: getStatusState(STATUSES.INIT),
  }))

  store.on(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, (state, { status, data, error }) => ({
    searchSubscriptions: {
      ...state.searchSubscriptions,
      ...getStatusState(status),
      data,
      error,
    },
  }))

  store.on(types.SAVE_SUBSCRIPTION, async (_, { user = {}, searchQuery }) => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({
      method: 'POST',
      endpoint: 'subscriptions',
      body: {
        email: user.email,
        searchQuery,
      },
    })

    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.LOADED,
      })
      store.dispatch(types.GET_SUBSCRIPTIONS)
    }
  })

  store.on(types.GET_SUBSCRIPTIONS, async () => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { data, error } = await api({ method: 'GET', endpoint: 'subscriptions' })
    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.LOADED,
        data,
      })
    }
  })

  store.on(types.READ_SUBSCRIPTION, () => ({}))

  store.on(types.SILENCE_SUBSCRIPTION, () => ({}))

  store.on(types.DELETE_SUBSCRIPTION, async (_, { id }) => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'DELETE', endpoint: `subscriptions/${id}` })
    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'subscriptions' })
      if (error) {
        store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })
}
