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

  store.on('init-model', (_, { id }) => ({
    [`model-${id}`]: getInitAtom(),
  }))

  store.on('update-model', (state, { id, data }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      data
    },
  }))

  store.on('update-model-likes', (state, {modelId, currentUserId}) => {
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
        }
      },
    }
  })

  store.on('loading-model', (state, { id }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on('loaded-model', (state, { id, data }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on('fetch-model', async (state, { id }) => {
    store.dispatch('loading-model', { id })
    const { data } = await api({ method: 'GET', endpoint: `models/${id}` })
    store.dispatch('loaded-model', { id, data })
  })
}
