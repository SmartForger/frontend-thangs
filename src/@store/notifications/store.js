import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  filteredNotificationsCount: null,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    notifications: getInitAtom(),
  }))

  store.on('setFilteredNotificationsCount', (state, event) => ({
    notifications: {
      ...state.notifications,
      filteredNotificationsCount: event,
    },
  }))
}
