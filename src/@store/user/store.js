const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
  models: [],
})

export default store => {
  store.on('@init', () => ({
    user: getInitAtom(),
  }))

  store.on('update-user-models', (state, { data }) => ({
    user: {
      ...state.user,
      models: [...state.user.models, data],
    },
  }))
}
