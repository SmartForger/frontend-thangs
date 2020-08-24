import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
  models: [],
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    user: getInitAtom(),
  }))

  store.on(types.UPDATE_USER_MODELS, (state, { data }) => ({
    user: {
      ...state.user,
      models: [...state.user.models, data],
    },
  }))
}
