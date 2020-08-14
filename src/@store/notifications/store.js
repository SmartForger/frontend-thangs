const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  filteredNotificationsCount: null,
})

export default store => {
  store.on('@init', () => ({
    notifications: getInitAtom(),
  }))

  store.on('setFilteredNotificationsCount', (state, event) => ({
    notifications: {
      ...state.notifications,
      filteredNotificationsCount: event
    },
  }))
}
