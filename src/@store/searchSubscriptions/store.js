import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

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

  store.on(types.SAVE_SUBSCRIPTION, async (_, { searchTerm, modelId }) => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const subscriptionBody = modelId ? { modelId } : { searchTerm }

    const { error } = await api({
      method: 'POST',
      endpoint: 'subscriptions',
      body: subscriptionBody,
    })

    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.FETCH_SUBSCRIPTIONS)
      track('Save Search Subscription', { searchTerm })
    }
  })

  store.on(types.FETCH_SUBSCRIPTIONS, async () => {
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

  store.on(types.READ_SUBSCRIPTION, async (_, { id }) => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'GET', endpoint: `subscriptions/${id}` })
    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.FETCH_SUBSCRIPTIONS)
    }
  })

  store.on(types.ENABLE_SUBSCRIPTION, async (_, { id }) => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({
      method: 'POST',
      endpoint: `subscriptions/${id}/enable`,
    })
    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.FETCH_SUBSCRIPTIONS)
    }
  })

  store.on(types.DISABLE_SUBSCRIPTION, async (_, { id }) => {
    store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({
      method: 'POST',
      endpoint: `subscriptions/${id}/disable`,
    })
    if (error) {
      store.dispatch(types.CHANGE_SEARCH_SUBSCRIPTION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.FETCH_SUBSCRIPTIONS)
    }
  })

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
      store.dispatch(types.FETCH_SUBSCRIPTIONS)
    }
  })
}
