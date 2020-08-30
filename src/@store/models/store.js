import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on(types.INIT_MODEL, (_, { id }) => ({
    [`model-${id}`]: getInitAtom(),
  }))

  store.on(types.UPDATE_MODEL, (state, { id, data }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      data,
    },
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

  store.on(types.LOADING_MODEL, (state, { id }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on(types.LOADED_MODEL, (state, { id, data }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on(types.FETCH_MODEL, async (state, { id }) => {
    store.dispatch(types.LOADING_MODEL, { id })
    const { data } = await api({ method: 'GET', endpoint: `models/${id}` })
    store.dispatch(types.LOADED_MODEL, { id, data })
  })
}
